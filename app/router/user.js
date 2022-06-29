const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const router = express.Router();

router.get("/", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

router.post("/", async (req, res) => {
  const validuser = await User.findOne({ username: req.body.username });
  if (validuser) return res.status(400).send("User already exists");

  const user = new User(
    _.pick(req.body, ["firstname", "lastname", "username", "password"])
  );
  const salt =await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send({user, token});
});

module.exports = router;
