const mongoose = require("mongoose");

module.exports = mongoose.model("Wallet", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  balance: { type: Number, default: 0, min: 0 },
}, { timestamps: true }));
