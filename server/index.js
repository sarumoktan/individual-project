const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize, connectDB } = require("./config/db");
require("dotenv").config();
const { Register } = require("./models/association");

const app = express();

// 1. Security/CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Parsers (placed before routes)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 3. Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. Routes
app.use("/api", require("./routes/homeRoute"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Page" });
});

// 5. Server Lifecycle
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;

    await connectDB();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
