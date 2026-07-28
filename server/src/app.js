const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

app.use("/api/users", userRoutes);

module.exports = app;