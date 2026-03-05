const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getMySchedules,
  getScheduleById,
  addSchedule,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
  searchSchedules
} = require("../controllers/scheduleController");

router.get("/search", searchSchedules);
router.get("/", authMiddleware, getMySchedules);
router.get("/:id", authMiddleware, getScheduleById);
router.post("/", authMiddleware, addSchedule);
router.put("/:id", authMiddleware, updateSchedule);
router.patch("/:id/toggle", authMiddleware, toggleSchedule);
router.delete("/:id", authMiddleware, deleteSchedule);

module.exports = router;
