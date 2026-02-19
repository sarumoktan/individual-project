const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const { registerUser, loginUser } = require("../controllers/authController");
const {
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getMe,
} = require("../controllers/authController");

const authGuard = require("../helpers/authguard");
const isAdmin = require("../helpers/isAdmin");

// Auth routes
router.post("/adduser", registerUser);
router.post("/loginUser", loginUser);

// User CRUD routes
router.get("/getAllUser", authGuard, isAdmin, getAllUser);

// ✅ Fix: frontend calls GET /api/user/:id
router.get("/:id", authGuard, isAdmin, getUserById);

// ✅ Matches frontend PUT /api/user/update/:id
router.put("/update/:id", authGuard, updateUserById);

// ✅ Matches frontend DELETE /api/user/delete/:id
router.delete("/delete/:id", authGuard, isAdmin, deleteUserById);

// Profile of logged-in user
router.get("/getMe", authGuard, getMe);

module.exports = router;
