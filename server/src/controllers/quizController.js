const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const PointTransaction = require("../models/PointTransaction");

const { publicQuiz } = require("./dashboardController");

async function listActiveQuizzes(_req, res) {
  const quizzes = await Quiz.find({ status: "active" }).sort({ createdAt: -1 });
  return res.json({ success: true, quizzes: quizzes.map(publicQuiz) });
}

async function getQuiz(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, status: "active" });

  if (!quiz) return res.status(404).json({ success: false, message: "Active quiz not found" });
  return res.json({ success: true, quiz: publicQuiz(quiz) });
}

async function startQuiz(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, status: "active" });
  if (!quiz) return res.status(404).json({ success: false, message: "Active quiz not found" });

  const existingAttempt = await QuizAttempt.findOne({ user: req.auth.sub, quiz: quiz._id });
  if (existingAttempt?.status === "completed") {
    return res.status(409).json({
      success: false,
      message: "You have already completed this quiz. Ask an admin to allow a retake.",
      attempt: existingAttempt,
    });
  }

  const attempt = await QuizAttempt.findOneAndUpdate(
    { user: req.auth.sub, quiz: quiz._id },
    { $setOnInsert: { user: req.auth.sub, quiz: quiz._id, status: "in-progress" } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return res.json({ success: true, quiz: publicQuiz(quiz), attempt });
}

async function submitQuiz(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, status: "active" }).select(
    "+questions.options.isCorrect"
  );
  if (!quiz) return res.status(404).json({ success: false, message: "Active quiz not found" });

  const existingAttempt = await QuizAttempt.findOne({ user: req.auth.sub, quiz: quiz._id });
  if (existingAttempt?.status === "completed") {
    return res.status(409).json({
      success: false,
      message: "This quiz has already been completed. Ask an admin to allow a retake.",
    });
  }

  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const submitted = new Map(answers.map((answer) => [String(answer.questionId), new Set((answer.optionIds || []).map(String))]));
  let correct = 0;

  for (const question of quiz.questions) {
    const selected = submitted.get(String(question._id)) || new Set();
    const expected = new Set(question.options.filter((option) => option.isCorrect).map((option) => String(option._id)));
    if (selected.size === expected.size && [...selected].every((optionId) => expected.has(optionId))) correct += 1;
  }

  const score = quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0;
  const pointsAwarded = correct * 10;
  const attempt = await QuizAttempt.findOneAndUpdate(
    { user: req.auth.sub, quiz: quiz._id },
    { answers, status: "completed", score, pointsAwarded, completedAt: new Date() },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const user = await User.findByIdAndUpdate(
    req.auth.sub,
    { $inc: { points: pointsAwarded }, $addToSet: { badges: score === 100 ? "perfect-score" : "quiz-taker" } },
    { new: true }
  );
  await PointTransaction.create({ user: req.auth.sub, points: pointsAwarded, reason: `Completed quiz: ${quiz.title}` });

  return res.json({ success: true, message: "Quiz submitted", attempt, user });
}

async function allowRetake(req, res) {
  const attempt = await QuizAttempt.findOneAndUpdate(
    { user: req.params.userId, quiz: req.params.id, status: "completed" },
    { answers: [], status: "in-progress", score: 0, pointsAwarded: 0, completedAt: null },
    { new: true }
  );

  if (!attempt) {
    return res.status(404).json({
      success: false,
      message: "Completed quiz attempt not found for this user",
    });
  }

  return res.json({ success: true, message: "Retake allowed for this user", attempt });
}

async function createQuiz(req, res) {
  const { title, description, imageUrl, questions } = req.body;
  if (!title?.trim() || !Array.isArray(questions) || questions.length < 1 || questions.length > 5) {
    return res.status(400).json({ success: false, message: "Title and 1 to 5 questions are required" });
  }

  const quiz = await Quiz.create({ title: title.trim(), description, imageUrl, questions, createdBy: req.auth.sub, status: "inactive" });
  return res.status(201).json({ success: true, quiz: publicQuiz(quiz) });
}

async function updateQuizStatus(req, res) {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) return res.status(400).json({ success: false, message: "Status must be active or inactive" });

  const quiz = await Quiz.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
  return res.json({ success: true, quiz: publicQuiz(quiz) });
}

module.exports = { listActiveQuizzes, getQuiz, startQuiz, submitQuiz, allowRetake, createQuiz, updateQuizStatus };
