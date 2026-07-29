const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Authentication token has expired"
          : "Authentication token is invalid",
    });
  }
}

module.exports = authenticateToken;
