const router = require("express").Router();
const { createBooking, updateBooking, deleteBooking, getOccupancy, getUserBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createBooking);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);
router.get("/occupancy/:scheduleId", getOccupancy);
router.get("/get", authMiddleware, getUserBookings);

module.exports = router;