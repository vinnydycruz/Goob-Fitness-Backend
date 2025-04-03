const express = require('express');
const exercisesAPI = require('./src/workout_api.js')
const app = express();

app.use(express.json());

const port = process.env.PORT || 3001;

app.get("/exercises", async (req, res) => {
  const data = exercisesAPI.getResponse();
  const allExercises = exercisesAPI.parseResponse(data);
  const filteredExercises = excersisesAPI.getExercises(allExercises, req.body.level, req.body.equipment, rep.body.primaryMuscles);
});

const server = app.listen(port, () => {
    console.log(`Server Running!`);
});

module.exports = server;
