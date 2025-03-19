// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     age: { type: Number },
//     weight: { type: Number },
//     fitnessGoal: { type: String },
// });

//  const helth = mongoose.model("Fitness",userSchema);  //1st document name, 2nd schema name

//  module.exports = helth;



//part02


// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     age: { type: Number },
//     weight: { type: Number },
//     fitnessGoal: { type: String },
// });

// const Helth = mongoose.model("Helth", userSchema);  // Ensure the model name is consistent

// module.exports = Helth;






//deepseak




const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    nutritionPlan: { type: String }, // AI-generated nutrition plan
    workoutPlan: { type: String }, // AI-generated workout plan
    recoveryTreatments: { type: [String] } // AI-generated recovery treatments
});

const Helth = mongoose.model("Helth", userSchema);

module.exports = Helth;