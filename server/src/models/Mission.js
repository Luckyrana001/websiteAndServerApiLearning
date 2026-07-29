const mongoose = require("mongoose");

module.exports = mongoose.model("Mission", new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  target: { type: Number, default: 1 },
  rewardPoints: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true }));
