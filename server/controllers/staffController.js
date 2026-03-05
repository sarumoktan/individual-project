const { Staff } = require("../models/association");
const path = require("path");
const fs = require("fs");

// ── GET /api/staff
const getMyStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: { operator_id: req.user.user_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    console.error("getMyStaff:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/staff/:id
const getStaffById = async (req, res) => {
  try {
    const member = await Staff.findOne({
      where: { staff_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    return res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error("getStaffById:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/staff
const addStaff = async (req, res) => {
  try {
    const { name, phone, address, role } = req.body;

    if (!name || !phone || !address || !role) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, phone, address, and role are required.",
        });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    console.log(req.file)
    const member = await Staff.create({
      operator_id: req.user.user_id,
      name,
      phone,
      address,
      role,
      profile_url: image_url
    });

    return res.status(201).json({
      success: true,
      message: "Staff member added.",
      data: member,
    });
  } catch (error) {
    console.error("addStaff:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PUT /api/staff/:id
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user; // From your authMiddleware

    // 1. Find the member and ensure they belong to this operator
    const member = await Staff.findOne({
      where: { staff_id: id, operator_id: user_id },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found or unauthorized.",
      });
    }

    const { name, phone, address, role, is_active } = req.body;

    let image_url = member.profile_url;

    if (req.file) {
      if (member.profile_url) {
        const oldPath = path.join(__dirname, "..", member.profile_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    await member.update({
      name: name || member.name,
      phone: phone || member.phone,
      address: address || member.address,
      role: role || member.role,
      profile_url: image_url,
      is_active: is_active !== undefined ? is_active : member.is_active,
    });

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully.",
      data: member,
    });
  } catch (error) {
    console.error("updateStaff Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PATCH /api/staff/:id/toggle
const toggleStaffStatus = async (req, res) => {
  try {
    const member = await Staff.findOne({
      where: { staff_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    await member.update({ is_active: !member.is_active });

    return res.status(200).json({
      success: true,
      message: `${member.name} set to ${member.is_active ? "Active" : "Inactive"}.`,
      data: { staff_id: member.staff_id, is_active: member.is_active },
    });
  } catch (error) {
    console.error("toggleStaffStatus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── DELETE /api/staff/:id
const deleteStaff = async (req, res) => {
  try {
    const member = await Staff.findOne({
      where: { staff_id: req.params.id, operator_id: req.user.user_id },
    });

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    // Clean up uploaded files
    [member.photo_url, member.id_doc_url, member.license_doc_url].forEach(
      (url) => {
        if (!url) return;
        const p = path.join(__dirname, "..", "public", url);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      },
    );

    await member.destroy();

    return res.status(200).json({
      success: true,
      message: `${member.name} removed from staff.`,
    });
  } catch (error) {
    console.error("deleteStaff:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getMyStaff,
  getStaffById,
  addStaff,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
};
