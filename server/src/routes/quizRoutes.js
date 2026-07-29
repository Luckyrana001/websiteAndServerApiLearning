const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");
const { listActiveQuizzes, getQuiz, startQuiz, submitQuiz, allowRetake, createQuiz, updateQuizStatus } = require("../controllers/quizController");

const router = express.Router();
router.use(authenticateToken);
router.get("/active", listActiveQuizzes);
router.get("/:id", getQuiz);
router.post("/:id/start", startQuiz);
router.post("/:id/submit", submitQuiz);
router.post("/:id/retake/:userId", requireAdmin, allowRetake);
router.post("/", requireAdmin, createQuiz);
router.patch("/:id/status", requireAdmin, updateQuizStatus);

module.exports = router;
