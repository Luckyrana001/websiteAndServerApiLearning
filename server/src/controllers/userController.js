const STATUS = require("../constants/httpStatus");
const userService = require("../services/userService");
const { sendSuccess } = require("../utils/responseHandler");

async function getUsers(_req, res, next) {
  try {
    const users = await userService.listUsers();
    return sendSuccess(res, STATUS.OK, { count: users.length, users });
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(res, STATUS.CREATED, {
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = STATUS.NOT_FOUND;
      return next(error);
    }

    return sendSuccess(res, STATUS.OK, {
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userService.deleteUser(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = STATUS.NOT_FOUND;
      return next(error);
    }

    return sendSuccess(res, STATUS.OK, {
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
