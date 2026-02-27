const cors = require("cors");
const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./config/db");
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies, auth headers
  }),
);

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//make uploads folder public
app.use("/uploads", express.static("uploads"));

//userRoutes and productRoutes
app.use("/api/auth", require("./routes/authRoute"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Page" });
});

//start server
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  await connectDB();
  await sequelize.sync({ alter: true }); //force and sync
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
