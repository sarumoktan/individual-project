const { Register} = require("../models/association");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ── Register User ────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, phone } = req.body;

    // 1. Check if user already exists
    const existingEmail = await Register.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const existingPhone = await Register.findOne({ where: { phone_no: phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "User with this phone no. already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const newUser = await Register.create({
      username: fullName,
      email,
      password: hashedPassword,
      role: role || "passenger",
      phone_no:phone
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ── Login User ───────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await Register.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "your_super_secret_key",
      { expiresIn: "1d" },
    );

    // 4. Send response (and optionally set a cookie)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ── Get Current User Profile ──────────────────────────────────────────────────
// ── Get Specific User Profile ────────────────────────────────────────────────
const getUser = async (req, res) => {
  try {
    // req.user.user_id is extracted from your JWT middleware
    const userId = req.user.user_id;

    const user = await Register.findByPk(userId, {
      attributes: ["username", "email", "phone_no"], // Only fetch these 3 fields
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Returns: { "username": "...", "email": "...", "phone_no": "..." }
    res.status(200).json(user);

  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error fetching user details" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.user_id; // From your authMiddleware
    const { username, email, phone_no } = req.body;

    // 1. Find the user first
    let user = await Register.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Prepare the update object
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone_no) updateData.phone_no = phone_no;

    // 4. Execute update
    await user.update(updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phone_no: user.phone_no
      }
    });
  } catch (error) {
    console.error("Update User Error:", error);
    // Handle unique constraint errors (e.g., email already taken)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email or Phone already in use" });
    }
    res.status(500).json({ message: "Server error updating user details" });
  }
};
module.exports = { registerUser, loginUser, getUser, updateUser };
