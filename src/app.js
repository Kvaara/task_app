const express = require("express");

require("./db/task_app_api.js");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

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
