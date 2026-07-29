const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { getDashboard, getLeaderboard, getAdminDashboard } = require("../controllers/dashboardController");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authenticateToken);
router.get("/", getDashboard);
router.get("/leaderboard", getLeaderboard);
router.get("/admin", requireAdmin, getAdminDashboard);

module.exports = router;
