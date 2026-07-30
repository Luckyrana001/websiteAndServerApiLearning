function sendSuccess(res, statusCode, data = {}) {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
}

function sendError(res, statusCode, message, extra = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...extra,
  });
}

module.exports = { sendSuccess, sendError };
