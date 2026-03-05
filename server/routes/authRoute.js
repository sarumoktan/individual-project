const { Router } = require("express");
const { registerUser, loginUser, getUser, updateUser } = require("../controllers/authController.js")
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);

module.exports = router;
