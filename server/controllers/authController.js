
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Register = require("../models/userModel");

//for getting token
const verifyToken = () => {
  //verification token for verifying
  const verificationToken = crypto.randomBytes(32).toString("hex");

  //token expiry (1 hours)
  const verificationTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return { verificationToken, verificationTokenExpires };
};

//user registeration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "please fill all the fields",
    });
  }

  //check whether the email already exists
  const user = await Register.findOne({ where: { email: email } });
  if (user) {
    return res.status(400).json({
      message: `${username} already exists`,
    });
  }

  //for getting token and hasing the password
  const { verificationToken, verificationTokenExpires } = verifyToken();

  //hashing password
  const hashedPassword = bcrypt.hashSync(password, 10);

  //passing data to model
  const currentUser = await Register.create({
    role: role === "organization" ? "organization" : "individual",
    username,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
  });

  return res.status(201).json({
    success: true,
    message: "User added successfully",
    user: {
      username: currentUser.username,
      email: currentUser.email,
    },
  });
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "pleasee enter valid email address",
      });
    }

    const user = await Register.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        message: "unregistered email",
      });
    }

    const { verificationToken, verificationTokenExpires } = verifyToken();

    //link inside email
    const verifyLink = `http://localhost:5173/reset-password/${verificationToken}`;
    const html = resetPasswordemailTemplate(verifyLink);

    //sending email
    emailSender(html, "Reset password request", email);

    ((user.verificationToken = verificationToken),
      (user.verificationTokenExpires = verificationTokenExpires),
      await user.save());

    return res.status(201).json({
      message: "email sent, please verify yourself",
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

//for login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email or password cannot be empty",
    });
  }

  const user = await Register.findOne({ where: { email: email } });

  //if there is no user
  if (!user) {
    return res.status(404).json({
      message: ` no user with this email ${email} exists `,
    });
  } else if (!user.isVerified) {
    return res.status(403).json({
      message: `${email} isn't verified. Please verify yourself`,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    //for JWT login token
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return res.status(200).json({
      success: true,
      message: "login successful",
      token: token,
    });
  } else {
    return res.status(400).json({
      message: "email or password didn't match",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { password } = req.body;

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No password passed",
      });
    }

    const user = await Register.findByPk(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully. We're sorry to see you go!",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during account deletion",
      error: error.message,
    });
  }
};

module.exports = { registerUser, userLogin, deleteUser, forgotPassword };
