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


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    weight: { type: Number },
    fitnessGoal: { type: String },
});

const Helth = mongoose.model("Helth", userSchema);  // Ensure the model name is consistent

module.exports = Helth;