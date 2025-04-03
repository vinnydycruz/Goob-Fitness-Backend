const { User, validate } = require("../user");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const cors = require("cors");

router.post("/", cors(), express.json(), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "username", "email", "password", "weight", "progress"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["_id", "name", "username", "email", "weight", "progress"]));
});

router.get("/", cors(), async (req, res) => {
  if (!req.query.username) return res.status(400).send("Username is required.");

  try {
    let user = await User.findOne({ username: req.query.username });
    if (!user) return res.status(404).send("User not found.");

    res.send(_.pick(user, ["_id", "name", "username", "email", "weight", "progress"]));
  } catch (error) {
    res.status(500).send("An error occurred while fetching the user.");
    console.log(error);
  }
});

module.exports = router;
