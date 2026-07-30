const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  validateUserBody,
  validateUserId,
} = require("../validators/userValidator");

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get("/", getUsers);
router.post("/", validateUserBody, createUser);

router.put("/:id", validateUserId, validateUserBody, updateUser);
router.delete("/:id", validateUserId, deleteUser);

module.exports = router;
