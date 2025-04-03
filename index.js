const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const exercisesAPI = require("./src/workout_api.js");

const users = require("./mongo/routers/users");
const auth = require("./mongo/routers/auth");
const post = require("./mongo/routers/posts");
const comment = require("./mongo/routers/comments");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/Social") // need to switch to come from a config file
  .then(() => {
    console.log("Connected to MongoDB");
  }) // better to use debug module for this
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(cookieParser());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/comment", comment);

const port = process.env.PORT || 3001;

app.get("/exercises", cors(), async (req, res) => {
  const { level, equipment, primaryMuscles } = req.query;
  const dataPromise = exercisesAPI.getResponse();
  dataPromise
    .then((response) => {
      const data = response.data;
      console.log(response.data);
      const allExercises = exercisesAPI.parseResponse(data);
      const filteredExercises = exercisesAPI.getExercises(allExercises, level, equipment, primaryMuscles);
      res.send(filteredExercises);
    })
    .catch((error) => console.error("Error fetching data:", error));
});

app.get("/workout", cors(), async (req, res) => {
  try {
    const { level, equipment, primaryMuscles } = req.query;
    console.log("level: " + level, " equipment: " + equipment + " primaryMuscles: " + primaryMuscles);
    let primaryMusclesArray = [primaryMuscles];

    const data = await exercisesAPI.getResponse();
    const exercises = exercisesAPI.parseResponse(data);
    const workoutPlan = exercisesAPI.createWorkoutPlan(exercises, level, equipment, primaryMusclesArray);
    res.send(workoutPlan);
  } catch (error) {
    res.status(500).send("Failed to create workout plan: " + error);
  }
});

const server = app.listen(port, () => {
  console.log(`Server Running!`);
});

module.exports = server;
