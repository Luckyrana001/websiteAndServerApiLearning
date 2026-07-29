const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      optionIds: [mongoose.Schema.Types.ObjectId],
    }],
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    score: { type: Number, default: 0 },
    pointsAwarded: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
