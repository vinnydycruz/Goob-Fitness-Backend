const { Post, validatePost } = require("../post");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../auth");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.post("/", auth, cors(corsOptions), express.json(), async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");

  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let post = await Post.findOne({ username: req.body.username, description: req.body.description });
  if (post) return res.status(400).send("Post already exists");

  post = new Post(_.pick(req.body, ["username", "image", "description", "createdAt", "isPosted"]));
  await post.save();
  res.send(_.pick(post, ["_id", "username", "description", "createdAt", "isPosted"]));
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.send(posts);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
