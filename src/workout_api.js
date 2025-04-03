const { http } = require("http");
// const express = require("express"); //idk about this
// const app = express(); //idk about this
const axios = require("axios");

class Exercise {
  constructor(name, level, equipment, primaryMuscles, instructions) {
    this.name = name;
    this.level = level;
    this.equipment = equipment;
    this.primaryMuscles = primaryMuscles;
    this.instructions = instructions;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// returns response from API
function getResponse() {
  const url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
  return axios.get(url);
}

// parseResponse expects the response from getResponse
function parseResponse(response) {
  return response.map((exercise) => new Exercise(exercise.name, exercise.level, exercise.equipment, exercise.primaryMuscles, exercise.instructions));
}

// return excercises based on array of excercises, level, equipment, primaryMuscles
function getExercises(allExercises, level, equipment, primaryMuscles) {
  const matchingExercises = allExercises
    .filter((exercise) => {
      return (
        (!level || exercise.level === level) &&
        (!equipment || exercise.equipment === equipment) &&
        (!primaryMuscles || primaryMuscles.length === 0 || exercise.primaryMuscles.some((muscle) => primaryMuscles.includes(muscle)))
      );
    })
    .map((exercise) => {
      return new Exercise(exercise.name, exercise.level, exercise.equipment, exercise.primaryMuscles, exercise.instructions);
    });

  return matchingExercises;
}

// createWorkoutPlan expects the array of excercises, level, equipment, primaryMuscles and returns an array of excercises
function createWorkoutPlan(allExercises, level, equipment, primaryMuscles) {
  let filteredExercises = getExercises(allExercises, level, equipment, primaryMuscles);
  const workoutSize = Math.min(filteredExercises.length, randomInt(8, 11));
  const selectedExercises = [];
  while (selectedExercises.length < workoutSize) {
    const index = randomInt(0, filteredExercises.length);
    const exercise = filteredExercises[index];
    if (!selectedExercises.some((e) => e.name === exercise.name)) {
      selectedExercises.push(exercise);
    }
  }
  return selectedExercises;
}

/*app.get("/exercises", async (req, res) => {
  const data = await getResponse();
  const exercises = parseResponse(data);
  res.json(exercises);
});*/

module.exports = {
  getResponse,
  parseResponse,
  getExercises,
  createWorkoutPlan,
  Exercise,
  randomInt,
};
