jest.mock("axios");

const { getResponse, parseResponse, getExercises, createWorkoutPlan, Exercise, randomInt } = require("../src/workout_api");
const axios = require("axios");

describe("API functions", () => {
  test("get response returns response from api", async () => {
    const SAMPLEDATA = {
      id: "Alternate_Incline_Dumbbell_Curl",
      name: "Alternate Incline Dumbbell Curl",
      force: "pull",
      level: "beginner",
      mechanic: "isolation",
      equipment: "dumbbell",
      primaryMuscles: ["biceps"],
      secondaryMuscles: ["forearms"],
      instructions: [
        "Sit down on an incline bench with a dumbbell in each hand being held at arms length. Tip: Keep the elbows close to the torso.This will be your starting position.",
      ],
      category: "strength",
      images: [
        "Alternate_Incline_Dumbbell_Curl/0.jpg",
        "Alternate_Incline_Dumbbell_Curl/1.jpg",
      ],
    };

    const EXPECTED_KEYS = [
      "id",
      "name",
      "force",
      "level",
      "mechanic",
      "equipment",
      "primaryMuscles",
      "secondaryMuscles",
      "instructions",
      "category",
      "images",
    ];

    axios.get.mockResolvedValue({ data: SAMPLEDATA });

    const response = await getResponse();

    EXPECTED_KEYS.forEach((key) => {
      expect(response).toHaveProperty(key);
    });
  });

  test("parse response returns id, name, level, equipment, primaryMuscles, and instructions", () => {
    const RESPONSE = [{
      id: "Alternate_Incline_Dumbbell_Curl",
      name: "Alternate Incline Dumbbell Curl",
      level: "beginner",
      equipment: "dumbbell",
      primaryMuscles: ["biceps"],
      instructions: [
        "Sit down on an incline bench with a dumbbell in each hand being held at arms length. Tip: Keep the elbows close to the torso.This will be your starting position.",
      ],
    }];

    const EXPECTEDOUTPUT = [ new Exercise(
      "Alternate Incline Dumbbell Curl",
      "beginner",
      "dumbbell",
      ["biceps"],
      [
        "Sit down on an incline bench with a dumbbell in each hand being held at arms length. Tip: Keep the elbows close to the torso.This will be your starting position.",
      ],
    )];

    expect(parseResponse(RESPONSE)).toEqual(EXPECTEDOUTPUT);
  });

  test("getExercises returns an array of Exercise objects that match the criteria", () => {
    const testExercise = [new Exercise(
      "Alternate Incline Dumbbell Curl",
      "beginner",
      "dumbbell",
      ["biceps"],
      ["Sit down on an incline bench with a dumbbell."]
    )];

    expect(getExercises(testExercise, "beginner", "dumbbell", ["biceps"])).toEqual(testExercise);
  });

  test("getExercises returns an empty array of no exercises from a list of one exercise if the criteria is not met", () => {
    const testExercise = [new Exercise(
      "Alternate Incline Dumbbell Curl",
      "beginner",
      "dumbbell",
      ["biceps"],
      ["Sit down on an incline bench with a dumbbell."]
    )];

    expect(getExercises(testExercise, "intermediate", "dumbbell", ["biceps"])).toEqual([]);
  });

  test("getExercises returns an exercise even if the criteria is met but one parameter is NULL", () => {
    const testExercise = [new Exercise(
      "Alternate Incline Dumbbell Curl",
      "beginner",
      "dumbbell",
      ["biceps"],
      ["Sit down on an incline bench with a dumbbell."]
    )];

    expect(getExercises(testExercise, "beginner", "dumbbell")).toEqual(testExercise);
  });

  test("getExercises returns an array of two Exercise objects if two exercises meet the criteria", () => {
    const testExercise = [
      new Exercise("Alternate Incline Dumbbell Curl", "beginner", "dumbbell", ["biceps"], ["Sit down"]),
      new Exercise("Hammer Curl", "beginner", "dumbbell", ["biceps"], ["Workout Description"])
    ];

    expect(getExercises(testExercise, "beginner", "dumbbell", ["biceps"])).toEqual(testExercise);
  });
});

describe("Workout Plan Generator", () => {
  const mockExercises = Array.from({ length: 15 }, (_, i) =>
    new Exercise(`Exercise ${i}`, "beginner", "dumbbell", ["biceps"], [`Instruction ${i}`])
  );

  test("createWorkoutPlan returns no more than 10 exercises", () => {
    const plan = createWorkoutPlan(mockExercises, "beginner", "dumbbell", ["biceps"]);
    expect(plan.length).toBeLessThanOrEqual(10);
  });

  test("createWorkoutPlan returns unique exercises", () => {
    const plan = createWorkoutPlan(mockExercises, "beginner", "dumbbell", ["biceps"]);
    const names = plan.map(e => e.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toEqual(names.length);
  });

  test("createWorkoutPlan returns empty array if no exercises match", () => {
    const plan = createWorkoutPlan(mockExercises, "advanced", "barbell", ["chest"]);
    expect(plan).toEqual([]);
  });
});
