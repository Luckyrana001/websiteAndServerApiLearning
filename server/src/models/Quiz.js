const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    isCorrect: { type: Boolean, default: false, select: false },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    allowMultiple: { type: Boolean, default: false },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "Each question needs at least two options",
      },
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (questions) => questions.length >= 1 && questions.length <= 5,
        message: "A quiz must contain between 1 and 5 questions",
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
