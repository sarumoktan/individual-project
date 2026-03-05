const express = require("express");
const router = express.Router();

const {
  getMyStaff,
  getStaffById,
  addStaff,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
} = require("../controllers/staffController");
const uploadImage = require("../utils/upload");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/", authMiddleware, getMyStaff);
router.get("/:id", authMiddleware, getStaffById);
router.post("/",authMiddleware, uploadImage, addStaff);
router.put("/:id", authMiddleware, uploadImage, updateStaff);
router.patch("/:id/toggle", authMiddleware, toggleStaffStatus);
router.delete("/:id", authMiddleware, deleteStaff);

module.exports = router;
