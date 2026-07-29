const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const Reward = require("../models/Reward");
const Mission = require("../models/Mission");
const Notification = require("../models/Notification");

function publicQuiz(quiz) {
  const value = quiz.toObject ? quiz.toObject() : quiz;
  return {
    ...value,
    questions: value.questions.map((question) => ({
      ...question,
      options: question.options.map(({ isCorrect, ...option }) => option),
    })),
  };
}

async function getDashboard(req, res) {
  const [user, quizzes, attempts, rewards, missions, notifications] = await Promise.all([
    User.findById(req.auth.sub),
    Quiz.find({ status: "active" }).sort({ createdAt: -1 }),
    QuizAttempt.find({ user: req.auth.sub }).populate("quiz", "title"),
    Reward.find({ status: "active" }).sort({ pointsCost: 1 }).limit(6),
    Mission.find({ status: "active" }).limit(6),
    Notification.find({ user: req.auth.sub }).sort({ createdAt: -1 }).limit(10),
  ]);

  return res.json({
    success: true,
    user,
    activeQuizzes: quizzes.map(publicQuiz),
    inProgress: attempts.filter((attempt) => attempt.status === "in-progress"),
    rewards,
    missions,
    notifications,
  });
}

async function getLeaderboard(_req, res) {
  const users = await User.find({ role: "normal" })
    .select("name points badges")
    .sort({ points: -1, name: 1 })
    .limit(50);

  return res.json({ success: true, leaderboard: users });
}

async function getAdminDashboard(_req, res) {
  const [users, quizzes, attempts, completedAttempts] = await Promise.all([
    User.find({ role: "normal" }).select("name email points badges createdAt").sort({ createdAt: -1 }),
    Quiz.find().select("title status questions createdAt").sort({ createdAt: -1 }),
    QuizAttempt.countDocuments({ status: "completed" }),
    QuizAttempt.find({ status: "completed" }).populate("user", "name email").populate("quiz", "title").sort({ completedAt: -1 }).limit(100),
  ]);

  return res.json({
    success: true,
    stats: {
      users: users.length,
      quizzes: quizzes.length,
      activeQuizzes: quizzes.filter((quiz) => quiz.status === "active").length,
      completedAttempts: attempts,
    },
    users,
    quizzes,
    completedAttempts,
  });
}

module.exports = { getDashboard, getLeaderboard, getAdminDashboard, publicQuiz };
