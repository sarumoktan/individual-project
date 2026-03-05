const { Bus } = require("../models/association");
const path = require("path");
const fs = require("fs");

// ── GET /api/buses
// Returns all buses for the logged-in operator
const getMyBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll({
      where: { operator_id: req.user.user_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: buses.length,
      data: buses,
    });
  } catch (error) {
    console.error("getMyBuses:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/buses/:id
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      where: {
        bus_id: req.params.busId,
        operator_id: req.user.user_id,
      },
    });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found." });
    }

    return res.status(200).json({ success: true, data: bus });
  } catch (error) {
    console.error("getBusById:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/buses
const addBus = async (req, res) => {
  try {
    const {
      plate,
      model,
      year,
      class: busClass,
      comfort,
      layout,
      seats,
      amenities,
    } = req.body;

    // Basic validation
    if (
      !plate ||
      !model ||
      !year ||
      !busClass ||
      !comfort ||
      !layout ||
      !seats
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check for duplicate plate
    const existing = await Bus.findOne({ where: { plate } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A bus with this plate already exists.",
      });
    }

    // Parse amenities — frontend sends JSON.stringify(['wifi', 'charging'])
    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    }

    // Handle uploaded image (assumes multer middleware)
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const bus = await Bus.create({
      operator_id: req.user.user_id,
      plate,
      model,
      year: parseInt(year),
      class: busClass,
      comfort,
      layout,
      seats: parseInt(seats),
      amenities: parsedAmenities,
      image_url,
    });

    return res.status(201).json({
      success: true,
      message: "Bus added successfully.",
      data: bus,
    });
  } catch (error) {
    console.error("addBus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PUT /api/buses/:id
const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      where: {
        bus_id: req.params.busId,
        operator_id: req.user.user_id,
      },
    });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found." });
    }

    const {
      plate,
      model,
      year,
      class: busClass,
      comfort,
      layout,
      seats,
      amenities,
      is_active,
    } = req.body;

    // If plate is changing, check it isn't taken by another bus
    if (plate && plate !== bus.plate) {
      const duplicate = await Bus.findOne({ where: { plate } });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "That plate is already registered.",
        });
      }
    }

    let parsedAmenities = bus.amenities;
    if (amenities) {
      parsedAmenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    }

    // Handle new image upload — remove old file if it exists
    let image_url = bus.image_url;
    if (req.file) {
      if (bus.image_url) {
        const oldPath = path.join(__dirname, "..", "public", bus.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    await bus.update({
      plate: plate ?? bus.plate,
      model: model ?? bus.model,
      year: year ? parseInt(year) : bus.year,
      class: busClass ?? bus.class,
      comfort: comfort ?? bus.comfort,
      layout: layout ?? bus.layout,
      seats: seats ? parseInt(seats) : bus.seats,
      amenities: parsedAmenities,
      image_url,
      is_active: is_active !== undefined ? is_active : bus.is_active,
    });

    return res.status(200).json({
      success: true,
      message: "Bus updated.",
      data: bus,
    });
  } catch (error) {
    console.error("updateBus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const toggleBusStatus = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      where: {
        bus_id: req.params.busId,
        operator_id: req.user.user_id,
      },
    });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found." });
    }

    await bus.update({ is_active: !bus.is_active });

    return res.status(200).json({
      success: true,
      message: `Bus marked as ${bus.is_active ? "active" : "inactive"}.`,
      data: { bus_id: bus.bus_id, is_active: bus.is_active },
    });
  } catch (error) {
    console.error("toggleBusStatus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── DELETE /api/buses/:id
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      where: {
        bus_id: req.params.busId,
        operator_id: req.user.user_id,
      },
    });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found." });
    }

    // Remove image file if it exists
    if (bus.image_url) {
      const imgPath = path.join(__dirname, "..", "public", bus.image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await bus.destroy();

    return res.status(200).json({
      success: true,
      message: `${bus.plate} removed from fleet.`,
    });
  } catch (error) {
    console.error("deleteBus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getMyBuses,
  getBusById,
  addBus,
  updateBus,
  toggleBusStatus,
  deleteBus,
};
