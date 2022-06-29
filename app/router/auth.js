const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../model/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const validuser = await User.findOne({ username: req.body.username });
  if (validuser) return res.status(400).send("User already exists");

  const user = new User(
    _.pick(req.body, ["firstname", "lastname", "username", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send({ user, token });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username and password");

  const password = bcrypt.compare(req.body.password, user.password);
  if (!password) return res.status(400).send("Invalid username and password");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
