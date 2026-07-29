const mongoose = require("mongoose");

module.exports = mongoose.model("Redemption", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward", required: true },
  pointsSpent: { type: Number, required: true },
  status: { type: String, enum: ["requested", "fulfilled", "cancelled"], default: "requested" },
}, { timestamps: true }));
