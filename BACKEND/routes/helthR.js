
const router = require("express").Router();
const mongoose = require("mongoose");
const Helth = require("../models/helth.js");
const User = require("../models/user.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../Middleware/authMiddleware.js"); // Import authMiddleware

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
    const { email } = req.user;
    
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

// // Generate AI workout, nutrition, and recovery plans
// router.route("/generate-plans/:id").post(async (req, res) => {
//     const userId = req.params.id;
//     const { fitnessGoal, preferences } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).send({ status: "Invalid user ID" });
//     }

//     try {
//         const user = await Helth.findById(userId);
//         if (!user) {
//             return res.status(404).send({ status: "User not found" });
//         }

//         // Generate workout plan
//         const workoutPrompt = `Generate a ${fitnessGoal} workout plan for someone who enjoys ${preferences.join(", ")}.`;
//         const workoutResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: workoutPrompt }]
//         });
//         const workoutPlan = workoutResponse.choices[0].message.content;

//         // Generate nutrition plan
//         const nutritionPrompt = `Generate a ${fitnessGoal} nutrition plan for someone who enjoys ${preferences.join(", ")}.`;
//         const nutritionResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: nutritionPrompt }]
//         });
//         const nutritionPlan = nutritionResponse.choices[0].message.content;

//         // Generate recovery treatments
//         const recoveryPrompt = `Suggest recovery treatments for someone with the following fitness goal: ${fitnessGoal}.`;
//         const recoveryResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: recoveryPrompt }]
//         });
//         const recoveryTreatments = recoveryResponse.choices[0].message.content.split("\n");

//         // Save plans to user
//         user.workoutPlan = workoutPlan;
//         user.nutritionPlan = nutritionPlan;
//         user.recoveryTreatments = recoveryTreatments;
//         await user.save();

//         res.status(200).send({ status: "Plans generated", workoutPlan, nutritionPlan, recoveryTreatments });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ status: "Error generating plans", error: err.message });
//     }
// });


// Generate AI workout, nutrition, and recovery plans
router.route("/generate-plans").post(authMiddleware(), async (req, res) => {
    const { fitnessGoal, preferences } = req.body;
    const { email } = req.user; // Get email from JWT

    try {
        // Fetch userID from users collection
        const user = await User.findOne({ email }).select('userID email fullName');
        if (!user) {
            return res.status(404).send({ status: "User not found in users collection" });
        }

        // Find or create Helth document for this userID
        let helthUser = await Helth.findOne({ userID: user.userID });
        if (!helthUser) {
            helthUser = new Helth({
                userID: user.userID,
                email: user.email,
                name: user.fullName,
                fitnessGoal,
                preferences
            });
        }

        // Generate workout plan
        const workoutPrompt = `Generate a ${fitnessGoal} workout plan for someone who enjoys ${preferences.join(", ")}.`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const workoutPlan = await getGeminiResponseText(model, workoutPrompt);

        // Generate nutrition plan
        const nutritionPrompt = `Generate a ${fitnessGoal} nutrition plan for someone who enjoys ${preferences.join(", ")}.`;
        const nutritionPlan = await getGeminiResponseText(model, nutritionPrompt);

        // Generate recovery treatments
        const recoveryPrompt = `Suggest recovery treatments for someone with the following fitness goal: ${fitnessGoal}.`;
        const recoveryTreatments = (await getGeminiResponseText(model, recoveryPrompt)).split("\n");

        // Save plans to Helth document
        helthUser.workoutPlan = workoutPlan;
        helthUser.nutritionPlan = nutritionPlan;
        helthUser.recoveryTreatments = recoveryTreatments;
        helthUser.fitnessGoal = fitnessGoal;
        helthUser.preferences = preferences;
        await helthUser.save();

        res.status(200).send({ status: "Plans generated", workoutPlan, nutritionPlan, recoveryTreatments });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error generating plans", error: err.message });
    }
});



// Export the router
module.exports = router;
