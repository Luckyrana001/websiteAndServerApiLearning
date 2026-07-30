const STATUS = require("../constants/httpStatus");
const { sendError } = require("../utils/responseHandler");

function errorHandler(error, _req, res, _next) {
  console.error("Request error:", error);

  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return sendError(res, STATUS.BAD_REQUEST, firstError.message);
  }

  if (error.name === "CastError") {
    return sendError(res, STATUS.BAD_REQUEST, "Invalid request data");
  }

  if (error.code === 11000) {
    return sendError(res, STATUS.CONFLICT, "A user with this email already exists");
  }

  const statusCode = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
  const message = statusCode >= STATUS.INTERNAL_SERVER_ERROR
    ? "Internal server error"
    : error.message;

  return sendError(res, statusCode, message);
}

module.exports = errorHandler;
