const mongoose = require("mongoose");
const User = require("../models/User");

async function getUsers(req, res) {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users",
      error: error.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, age } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const normalisedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalisedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const userData = {
      name: name.trim(),
      email: normalisedEmail,
    };

    if (age !== undefined && age !== null && age !== "") {
      userData.age = Number(age);
    }

    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return handleControllerError(res, error, "Unable to create user");
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const normalisedEmail = email.trim().toLowerCase();

    const duplicateUser = await User.findOne({
      email: normalisedEmail,
      _id: {
        $ne: id,
      },
    });

    if (duplicateUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    user.name = name.trim();
    user.email = normalisedEmail;

    if (age === undefined || age === null || age === "") {
      user.age = undefined;
    } else {
      user.age = Number(age);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return handleControllerError(res, error, "Unable to update user");
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return handleControllerError(res, error, "Unable to delete user");
  }
}

function handleControllerError(res, error, defaultMessage) {
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];

    return res.status(400).json({
      success: false,
      message: firstError.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: defaultMessage,
    error: error.message,
  });
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};