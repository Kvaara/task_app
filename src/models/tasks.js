const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const taskSchema = mongoose.Schema({
  description: {
    required: true,
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

taskSchema.pre("save", async function (next) {
  const task = this;
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
