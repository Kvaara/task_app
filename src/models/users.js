const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.statics.findByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid email and/or password...");

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) console.log("Invalid email and/or password...");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ id: user._id.toString() }, "TerveTerveTerva");

  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
