const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

require("./db/task_app_api.js");
const Task = require("./models/tasks.js");
const User = require("./models/users.js");

app.use(express.json());

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);

  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes an user is found but its body is empty.
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    return res.status(302).send(user);
  } catch (e) {
    if (Object.keys(e.reason).length === 0) {
      return res.status(404).send(e.reason);
    }
    return res.status(500).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes a task is found but its body is empty.
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    return res.status(302).send(task);
  } catch (e) {
    if (Object.keys(e.reason).length === 0) {
      return res.status(404).send(e.reason);
    }
    return res.status(500).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes a task is found but its body is empty.
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  // Returns an array that includes the body object keys.
  const givenUpdates = Object.keys(body);
  // We make an array of all of the valid updates. You can't update something like the ObjectID or a property that doesn't exist.
  const validUpdates = ["name", "age", "email", "password"];
  // Goes through every value in the givenUpdates array. Returns true if every iteration is true, else returns false if even one iteration is false.
  const isValid = givenUpdates.every((givenUpdate) =>
    validUpdates.includes(givenUpdate)
  );

  if (!isValid) {
    return res.status(400).send({ error: "Not a valid update" });
  }

  try {
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes a task is found but its body is empty.
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  // Returns an array that includes the body object keys.
  const givenUpdates = Object.keys(body);
  // We make an array of all of the valid updates. You can't update something like the ObjectID or a property that doesn't exist.
  const validUpdates = ["completed", "description"];
  // Goes through every value in the givenUpdates array. Returns true if every iteration is true, else returns false if even one iteration is false.
  const isValid = givenUpdates.every((givenUpdate) =>
    validUpdates.includes(givenUpdate)
  );

  if (!isValid) {
    return res.status(400).send({ error: "Not a valid update" });
  }

  try {
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return res.send(task);
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    return res.send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send({ error: "Task not found." });
    }
    return res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
