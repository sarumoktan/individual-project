const { Router } = require("express");
const router = Router();

const authRoute = require("./authRoute.js");
const busRoute = require("./busRoute.js");
const staffRoute = require("./staffRoute.js");
const scheduleRoute = require("./scheduleRoute.js");
const bookingRoute = require("./bookingRoute.js");
const paymentController = require("../controllers/paymentController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.use("/auth", authRoute);
router.use("/bus", busRoute);
router.use("/staff", staffRoute);
router.use("/schedule", scheduleRoute);
router.use("/booking", bookingRoute);
router.post("/payment", authMiddleware, paymentController);

module.exports = router;
