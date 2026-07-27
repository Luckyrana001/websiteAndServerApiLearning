const express = require("express");
const cors = require("cors");

const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Root API was called");

  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/users", userRoutes);

module.exports = app;