const jwt = require("jsonwebtoken");

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
}

module.exports = { createAccessToken };
