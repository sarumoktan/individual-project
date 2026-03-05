const express = require("express");
const router = express.Router();
const uploadImage = require("../utils/upload");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getMyBuses,
  getBusById,
  addBus,
  updateBus,
  toggleBusStatus,
  deleteBus,
} = require("../controllers/busController");

router.get("/",authMiddleware, getMyBuses);
router.get("/:busId",authMiddleware, getBusById);
router.post("/", authMiddleware, uploadImage, addBus);
router.put("/:busId", authMiddleware, uploadImage, updateBus);
router.patch("/:busId/toggle", authMiddleware, toggleBusStatus);
router.delete("/:busId", authMiddleware, deleteBus);

module.exports = router;
