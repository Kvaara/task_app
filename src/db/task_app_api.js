const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-app-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established succesfully.");
  })
  .catch((error) => {
    console.log(
      `Couldn't establish a connection with the database. Error: ${error}`
    );
  });
