const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
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
    minLength: 8,
    trim: true,
    validate(password) {
      if (password.toLowerCase().includes("password"))
        throw new Error("Invalid password");
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
