const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: [6, "Password must contain at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["normal", "admin"],
      default: "normal",
    },

    points: {
      type: Number,
      default: 0,
      min: 0,
    },

    badges: [{
      type: String,
      trim: true,
    }],

    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, returnedUser) {
        delete returnedUser.password;
        return returnedUser;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
