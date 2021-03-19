const express = require("express");

require("./db/task_app_api.js");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

const Task = require("./models/tasks.js");
const User = require("./models/users.js");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   res.status(503).send("Service is on maintenance");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const main = async () => {
  // const task = await Task.findById("6054a4a375793a04c8439e0b");
  // await task.populate("user_id").execPopulate();
  // console.log(task.user_id);

  const user = await User.findById("605487a52579715450e05bbe");

  await user.populate("userTasks").execPopulate();
  console.log(user.userTasks);
};

main();
