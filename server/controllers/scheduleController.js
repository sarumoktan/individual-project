const {Schedule, Bus, Staff} = require("../models/association");

const includeRelations = [
  { model: Bus, as: "bus" },
  { model: Staff, as: "driver", foreignKey: "driver_id" },
  { model: Staff, as: "conductor", foreignKey: "conductor_id" },
];

const getMySchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      where: { operator_id: req.user.user_id },
      include: includeRelations,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    console.error("getMySchedules:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      where: { schedule_id: req.params.id, operator_id: req.user.user_id },
      include: includeRelations,
    });

    if (!schedule) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found." });
    }

    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error("getScheduleById:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const addSchedule = async (req, res) => {
  try {
    const {
      bus_id,
      driver_id,
      conductor_id,
      origin,
      destination,
      stops,
      departure_time,
      arrival_time,
      frequency,
      days,
      date,
      price,
    } = req.body;

    if (
      !bus_id ||
      !driver_id ||
      !origin ||
      !destination ||
      !departure_time ||
      !arrival_time ||
      !frequency ||
      !price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (origin === destination) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Origin and destination cannot be the same.",
        });
    }

    if (frequency === "Weekly" && (!days || days.length === 0)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Weekly schedules require at least one day.",
        });
    }

    if (frequency === "One-time" && !date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "One-time schedules require a date.",
        });
    }

    // Confirm bus belongs to this operator
    const bus = await Bus.findOne({
      where: { bus_id, operator_id: req.user.user_id },
    });
    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found in your fleet." });
    }

    const schedule = await Schedule.create({
      operator_id: req.user.user_id,
      bus_id,
      driver_id,
      conductor_id: conductor_id || null,
      origin,
      destination,
      stops: stops ?? [],
      departure_time,
      arrival_time,
      frequency,
      days: frequency === "Weekly" ? (days ?? []) : [],
      date: frequency === "One-time" ? date : null,
      price,
    });

    // Re-fetch with relations so response shape matches GET
    const full = await Schedule.findOne({
      where: { schedule_id: schedule.schedule_id },
      include: includeRelations,
    });

    return res.status(201).json({
      success: true,
      message: "Schedule created.",
      data: full,
    });
  } catch (error) {
    console.error("addSchedule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      where: { schedule_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!schedule) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found." });
    }

    const {
      bus_id,
      driver_id,
      conductor_id,
      origin,
      destination,
      stops,
      departure_time,
      arrival_time,
      frequency,
      days,
      date,
      price,
      is_active,
    } = req.body;

    const newFrequency = frequency ?? schedule.frequency;

    await schedule.update({
      bus_id: bus_id ?? schedule.bus_id,
      driver_id: driver_id ?? schedule.driver_id,
      conductor_id:
        conductor_id !== undefined
          ? conductor_id || null
          : schedule.conductor_id,
      origin: origin ?? schedule.origin,
      destination: destination ?? schedule.destination,
      stops: stops ?? schedule.stops,
      departure_time: departure_time ?? schedule.departure_time,
      arrival_time: arrival_time ?? schedule.arrival_time,
      frequency: newFrequency,
      days: newFrequency === "Weekly" ? (days ?? schedule.days) : [],
      date: newFrequency === "One-time" ? (date ?? schedule.date) : null,
      price: price ?? schedule.price,
      is_active: is_active !== undefined ? is_active : schedule.is_active,
    });

    const full = await Schedule.findOne({
      where: { schedule_id: schedule.schedule_id },
      include: includeRelations,
    });

    return res
      .status(200)
      .json({ success: true, message: "Schedule updated.", data: full });
  } catch (error) {
    console.error("updateSchedule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const toggleSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      where: { schedule_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!schedule) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found." });
    }

    await schedule.update({ is_active: !schedule.is_active });

    return res.status(200).json({
      success: true,
      message: `Schedule marked as ${schedule.is_active ? "active" : "inactive"}.`,
      data: {
        schedule_id: schedule.schedule_id,
        is_active: schedule.is_active,
      },
    });
  } catch (error) {
    console.error("toggleSchedule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      where: { schedule_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!schedule) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found." });
    }

    await schedule.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Schedule removed." });
  } catch (error) {
    console.error("deleteSchedule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const searchSchedules = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ success: false, message: "origin, destination and date are required." });
    }

    const searchDate = new Date(date);
    const dayOfWeek  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][searchDate.getDay()];

    const all = await Schedule.findAll({
      where: { origin, destination, is_active: true },
      include: includeRelations,
      order: [["departure_time", "ASC"]],
    });

    // Filter: Daily always, Weekly by day, One-time by exact date
    const results = all.filter(s => {
      if (s.frequency === 'Daily')    return true;
      if (s.frequency === 'Weekly')   return (s.days ?? []).includes(dayOfWeek);
      if (s.frequency === 'One-time') return s.date === date;
      return false;
    });

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("searchSchedules:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getMySchedules,
  getScheduleById,
  addSchedule,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
  searchSchedules
};
