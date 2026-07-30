const mongoose = require("mongoose");

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateUserBody(req, _res, next) {
  const { name, email, age } = req.body || {};

  if (typeof name !== "string" || !name.trim()) {
    return next(validationError("Name is required"));
  }

  if (typeof email !== "string" || !email.trim()) {
    return next(validationError("Email is required"));
  }

  if (age !== undefined && age !== null && age !== "") {
    const numericAge = Number(age);
    if (!Number.isFinite(numericAge) || numericAge < 0) {
      return next(validationError("Age must be a non-negative number"));
    }
  }

  return next();
}

function validateUserId(req, _res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(validationError("Invalid user ID"));
  }

  return next();
}

module.exports = { validateUserBody, validateUserId };
