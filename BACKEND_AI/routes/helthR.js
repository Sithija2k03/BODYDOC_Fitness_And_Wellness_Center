// const router = require("express").Router();
// let Helth = require("../models/helth.js");

// router.route("/add").post((req,res)=>{

// const  name =req.body.name;
// const email=req.body.email;
// const password=req.body.password;
// const age=Number(req.body.age);
// const weight=Number(req.body.weight);
// const fitnessGoal=req.body.fitnessGoal;

// const newHelth = new Helth ({
//         name,
//         email,
//         password,
//         age,
//         weight,
//         fitnessGoal
//     })

//     newHelth.save().then(()=>{
//         res.json("Helth Added")
//     }).catch((err)=>{
//         console.log(err);
//     })

// })

// //http://localhost:5000/helth

// router.route("/").get((req,res)=>{

//     Helth.find().then((helth)=>{
//         res.json(helth)
//     }).catch((err)=>{
//         console.log(err)
//     })
// })

// //http://localhost:5000/helth/update/

// router.route("/update/:id").put(async (req,res)=>{
//     let userId = req.params.id;
//     const {name,email,password,age,weight,fitnessGoal}=req.body;

//     const updateHelth = {
//         name,email,password,age,weight,fitnessGoal
//     }

//     const update = await Helth.findByIdAndUpdate(userId, updateHelth).then(()=>{
//         res.status(200).send({status : "User updated", user:update})
//     }).catch((err)=>{
//         console.log(err);
//         res.status(500).send({status:"Error with updating data"});
//     }) //await using for waitining for update user details

   
// })


// router.route("/delete/:id").delete(async(req,res)=>{
//     let userId= req.params.id;
//     await Helth.findByIdAndDelete(userId).then(()=>{
//         res.status(200).send({status: "User deleted"});
//     }).catch((err)=>{
//         console.log(err.message);
//         res.status(500).send({status: "Error with deleting user", error: err.message});
//     })
// })

// router.route("/get/:id").get(async(req,res)=>{
//     let userId = req.params.id;
//     const user = await Helth.findById(userId).then(() =>{
//         res.status(200).send({status:"User fetched",user: user})
//     }).catch(()=> {
//         console.log(err.message);
//         res.status(500).send({status: "Error with get user",error: err.message});
//     })
// })

// module.exports = router;



//part2


// const router = require("express").Router();
// const Helth = require("../models/helth.js");

// router.route("/add").post((req, res) => {
//     const { name, email, password, age, weight, fitnessGoal } = req.body;

//     const newHelth = new Helth({
//         name,
//         email,
//         password,
//         age,
//         weight,
//         fitnessGoal
//     });

//     newHelth.save()
//         .then(() => res.json("Health Added"))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route("/").get((req, res) => {
//     Helth.find()
//         .then(helth => res.json(helth))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route("/update/:id").put(async (req, res) => {
//     const userId = req.params.id;
//     const { name, email, password, age, weight, fitnessGoal } = req.body;

//     const updateHelth = {
//         name, email, password, age, weight, fitnessGoal
//     };

//     Helth.findByIdAndUpdate(userId, updateHelth, { new: true })
//         .then(user => res.status(200).send({ status: "User updated", user }))
//         .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
// });

// router.route("/delete/:id").delete(async (req, res) => {
//     const userId = req.params.id;
//     Helth.findByIdAndDelete(userId)
//         .then(() => res.status(200).send({ status: "User deleted" }))
//         .catch(err => res.status(500).send({ status: "Error with deleting user", error: err.message }));
// });

// router.route("/get/:id").get(async (req, res) => {
//     const userId = req.params.id;
//     Helth.findById(userId)
//         .then(user => res.status(200).send({ status: "User fetched", user }))
//         .catch(err => res.status(500).send({ status: "Error with get user", error: err.message }));
// });

// module.exports = router;



//deep seek



const router = require("express").Router();
const mongoose = require("mongoose");
const Helth = require("../models/helth.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper function to validate user ID
const validateUserId = (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }
};

// Helper function to find user by ID
const findUserById = async (userId) => {
    const user = await Helth.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

// Helper function to extract text response from Gemini API
const getGeminiResponseText = async (model, prompt) => {
    try {
        const result = await model.generateContent(prompt);
        console.log("Full API Response:", JSON.stringify(result, null, 2)); // Log the full response

        // Check for different response structures
        if (result?.response?.candidates) {
            return result.response.candidates[0]?.content?.parts?.map(part => part.text).join("\n") || "⚠️ No response generated.";
        } else if (result?.candidates) {
            return result.candidates[0]?.content?.parts?.map(part => part.text).join("\n") || "⚠️ No response generated.";
        } else {
            return "⚠️ Unexpected response structure.";
        }
    } catch (error) {
        console.error("❌ Error generating AI response:", error);
        return "⚠️ AI response failed.";
    }
};



// Log a workout
router.route("/log-workout/:id").post(async (req, res) => {
    const userId = req.params.id;
    const { exercise, duration, caloriesBurned } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "Invalid user ID" });
    }

    try {
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        user.workouts.push({ exercise, duration, caloriesBurned });
        await user.save();

        res.status(200).send({ status: "Workout logged", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error logging workout", error: err.message });
    }
});

// Track progress
router.route("/track-progress/:id").post(async (req, res) => {
    const userId = req.params.id;
    const { weight, bodyFatPercentage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "Invalid user ID" });
    }

    try {
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        user.progress.push({ weight, bodyFatPercentage });
        await user.save();

        res.status(200).send({ status: "Progress tracked", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error tracking progress", error: err.message });
    }
});

// Calculate BMI
router.route("/calculate-bmi/:id").get(async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "Invalid user ID" });
    }

    try {
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        const heightInMeters = user.height / 100;
        const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);
        user.bmi = bmi;
        await user.save();

        res.status(200).send({ status: "BMI calculated", bmi });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error calculating BMI", error: err.message });
    }
});

// Generate AI workout, nutrition, and recovery plans
router.route("/generate-plans/:id").post(async (req, res) => {
    const userId = req.params.id;
    const { fitnessGoal, preferences } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: "Invalid user ID" });
    }

    try {
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        // Generate workout plan
        const workoutPrompt = `Generate a ${fitnessGoal} workout plan for someone who enjoys ${preferences.join(", ")}.`;
        const workoutResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: workoutPrompt }]
        });
        const workoutPlan = workoutResponse.choices[0].message.content;

        // Generate nutrition plan
        const nutritionPrompt = `Generate a ${fitnessGoal} nutrition plan for someone who enjoys ${preferences.join(", ")}.`;
        const nutritionResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: nutritionPrompt }]
        });
        const nutritionPlan = nutritionResponse.choices[0].message.content;

        // Generate recovery treatments
        const recoveryPrompt = `Suggest recovery treatments for someone with the following fitness goal: ${fitnessGoal}.`;
        const recoveryResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: recoveryPrompt }]
        });
        const recoveryTreatments = recoveryResponse.choices[0].message.content.split("\n");

        // Save plans to user
        user.workoutPlan = workoutPlan;
        user.nutritionPlan = nutritionPlan;
        user.recoveryTreatments = recoveryTreatments;
        await user.save();

        res.status(200).send({ status: "Plans generated", workoutPlan, nutritionPlan, recoveryTreatments });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error generating plans", error: err.message });
    }
});

// Export the router
module.exports = router;
