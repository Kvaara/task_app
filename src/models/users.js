const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    validate(email) {
      if (!validator.isEmail(email)) throw new Error("Email is not valid");
    },
  },
  password: {
    required: true,
    type: String,
    minLength: 7,
    trim: true,
    validate(password) {
      if (password.toLowerCase().includes("password"))
        throw new Error("Invalid password");
    },
  },
});

module.exports = User;
