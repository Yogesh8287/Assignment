const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../model/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("Username already exists");

  user = new User(
    _.pick(req.body, ["firstname", "lastname", "username", "password"])
  );

  // hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // generate auth token
  const token = user.generateAuthToken();

  res.send({
    user: _.pick(user, ["_id", "username", "firstname", "lastname"]),
    token,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid username and password");

  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(400).send("Invalid username and password");

  const token = user.generateAuthToken();

  res.send({ token });
});

module.exports = router;
