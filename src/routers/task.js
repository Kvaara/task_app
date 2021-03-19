const express = require("express");
const Task = require("../models/tasks.js");
const auth = require("../middleware/auth.js");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    user_id: req.user._id,
  });

  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes a task is found but its body is empty.
router.get("/tasks/:id", async (req, res) => {
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
router.patch("/tasks/:id", async (req, res) => {
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
    const task = await Task.findById(id);

    givenUpdates.forEach((update) => (task[update] = body[update]));
    await task.save();
    return res.send(task);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
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

module.exports = router;
