const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { createAccessToken } = require("../config/auth");

async function register(req, res) {
  try {
    const { name, email, password, age } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const normalisedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalisedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const userData = {
      name: name.trim(),
      email: normalisedEmail,
      password: await bcrypt.hash(password, 12),
    };

    if (age !== undefined && age !== null && age !== "") {
      userData.age = Number(age);
    }

    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token: createAccessToken(user),
      user,
    });
  } catch (error) {
    return handleAuthError(res, error, "Unable to register user");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+password"
    );
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: createAccessToken(user),
      user,
    });
  } catch (error) {
    return handleAuthError(res, error, "Unable to log in");
  }
}

function handleAuthError(res, error, defaultMessage) {
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ success: false, message: firstError.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists",
    });
  }

  console.error(`${defaultMessage}:`, error);
  return res.status(500).json({ success: false, message: defaultMessage });
}

module.exports = { register, login };
