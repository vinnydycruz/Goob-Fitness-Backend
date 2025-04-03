const config = require("config");
const { User } = require("../user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../auth");
const router = express.Router();
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.options("/", cors(corsOptions));
router.post("/", cors(corsOptions), express.json(), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Recommended for HTTPS
    sameSite: "strict", // or 'lax' or 'none' depending on your needs
    // Other options like 'domain', 'path', 'expires' can be set as needed
  });

  res.status(204).send();
});

router.get("/me", cors(corsOptions), auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(400).send("User not found.");
  res.send(user);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req, { abortEarly: false });
}

module.exports = router;
