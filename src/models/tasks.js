const mongoose = require("mongoose");

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
  user_id: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
    ref: "User",
  },
});

taskSchema.pre("save", async function (next) {
  const task = this;
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
