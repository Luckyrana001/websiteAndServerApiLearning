const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getUsers);
router.post("/", createUser);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
