const mongoose = require("mongoose");

module.exports = mongoose.model("Reward", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  pointsCost: { type: Number, required: true, min: 0 },
  imageUrl: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true }));
