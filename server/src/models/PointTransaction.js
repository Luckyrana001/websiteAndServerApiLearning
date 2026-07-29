const mongoose = require("mongoose");

module.exports = mongoose.model("PointTransaction", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  reason: { type: String, required: true, trim: true },
}, { timestamps: true }));
