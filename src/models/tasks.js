const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
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

module.exports = Task;
