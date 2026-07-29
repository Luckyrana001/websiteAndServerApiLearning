const mongoose = require("mongoose");

module.exports = mongoose.model("UserMission", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mission: { type: mongoose.Schema.Types.ObjectId, ref: "Mission", required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
}, { timestamps: true }));
