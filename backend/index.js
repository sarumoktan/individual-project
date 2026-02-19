const express = require("express");
const app = express();


const userRoutes = require("./routes/userroutes");

const { connectDB, sequelize } = require("./database/database");

const cors = require("cors");
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}));

app.use(express.json());
app.use("/api/user/", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Homepage" });
});


const startServer = async () => {
    await connectDB();
    await sequelize.sync({alter : true});
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

startServer()


