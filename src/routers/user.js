const express = require("express");

const router = new express.Router();

const User = require("../models/users.js");
const auth = require("../middleware/auth.js");

router.post("/users", async (req, res) => {
  const newUser = new User(req.body);

  try {
    const token = await newUser.generateAuthToken();
    res.status(201).send({ user: newUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  const { user } = req;
  try {
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes a task is found but its body is empty.
router.patch("/users/:id", async (req, res) => {
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
    const user = await User.findById(id);
    // Changing a object property dynamically needs bracket notation and not dot notation. The value between brackets can be any expression.
    givenUpdates.forEach((update) => (user[update] = body[update]));
    await user.save();
    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
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

router.post("/users/login", async (req, res) => {
  const { body } = req;

  try {
    // Find user by the login email and password provided. Then generate an authorization token for the user's session.
    const user = await User.findByEmailAndPassword(body.email, body.password);
    const token = await user.generateAuthToken();

    // Send back status 200 with user's public profile and the token that's used in the current session
    return res.send({ user, token });
  } catch (e) {
    return res.status(401).send(e);
  }
});

router.post("/users/signout", auth, async (req, res) => {
  try {
    // let { user } = req;
    // const { token } = req.token;
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/signout/all", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(() => false);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;

// TODO: This endpoint doesn't send statuses to the client correctly if an user isn't found. Sometimes an user is found but its body is empty.
// router.get("/users/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);
//     return res.status(302).send(user);
//   } catch (e) {
//     if (Object.keys(e.reason).length === 0) {
//       return res.status(404).send(e.reason);
//     }
//     return res.status(500).send(e);
//   }
// });
