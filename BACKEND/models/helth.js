const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userID: { type: String, required: true }, // Links to User.userID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number }, // Add height for BMI calculation
  fitnessGoal: { type: String }, // e.g., "Lose weight", "Build muscle"
  preferences: { type: [String] }, // e.g., ["Yoga", "Weightlifting"]
  workouts: [{
    date: { type: Date, default: Date.now },
    exercise: { type: String },
    duration: { type: Number }, // in minutes
    caloriesBurned: { type: Number }
  }],
  progress: [{
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    bodyFatPercentage: { type: Number }
  }],
  bmi: { type: Number }, // Calculated BMI
  nutritionPlan: { type: String }, // AI-generated nutrition plan (consider removing if moved to User)
  recoveryTreatments: { type: [String] } // AI-generated recovery treatments
});

const Helth = mongoose.model("Helth", userSchema);

module.exports = Helth;