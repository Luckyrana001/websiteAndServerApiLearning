const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { sendError } = require("./utils/responseHandler");
const STATUS = require("./constants/httpStatus");
const errorHandler = require("./middleware/errorHandler");

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
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quizzes", quizRoutes);

app.use((req, res) => {
  return sendError(res, STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`);
});

app.use(errorHandler);

module.exports = app;
