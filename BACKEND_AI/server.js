
// npm run dev






// process.on("SIGINT", () => {
//     console.log("Shutting down server...");
//     process.exit();
// });


// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();
// require("dotenv").config();

// // const PORT = process.env.PORT || 8090;
// const PORT = process.env.PORT || 5000;


// app.use(cors());
// app.use(bodyParser.json());

// const URL = process.env.MONGODB_URL;

// mongoose.connect(URL)
//     .then(() => {
//         console.log("MongoDB Connection Success!");
//     })
//     .catch((err) => {
//         console.error("MongoDB Connection Error:", err);
//     });

//     const helthRouter = require("./routes/helthR.js");

//     app.use("/helth",helthRouter); 

// app.listen(PORT, () => {
//     console.log(`Server is up and running on port ${PORT}`);
// });



const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import the Helth model
const Helth = require("./models/helth.js");

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Function to extract text response from Gemini API
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

// AI Workout Plan Endpoint

app.post('/api/ai/workout', async (req, res) => {
    const { fitnessGoal, age, weight, height, userId } = req.body; // Add userId to identify the user

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `Create a structured 4-week workout plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
        - Include workout days, exercises, sets, reps, rest days, and progression over the 4 weeks.
        - Ensure the plan is balanced and suitable for beginners, intermediate, or advanced levels.`;

        console.log("Workout Plan Prompt:", prompt); // Log the prompt for debugging

        const workoutPlan = await getGeminiResponseText(model, prompt);

        if (workoutPlan.includes("⚠️")) {
            return res.status(400).json({
                message: "Error generating workout plan",
                error: workoutPlan,
            });
        }

        // Update the database with the generated workout plan
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.workoutPlan = workoutPlan.trim(); // Save the workout plan
        await user.save();

        res.json({
            message: "✅ Workout Plan Generated and Saved Successfully!",
            workoutPlan: workoutPlan.trim(),
        });
    } catch (error) {
        console.error("❌ Error generating workout plan:", error);
        res.status(500).json({ message: "Error generating workout plan", error: error.message });
    }
});



// app.post('/api/ai/workout', async (req, res) => {
//     const { fitnessGoal, age, weight, height } = req.body;

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//         const prompt = `Create a structured 4-week workout plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
//         - Include workout days, exercises, sets, reps, rest days, and progression over the 4 weeks.
//         - Ensure the plan is balanced and suitable for beginners, intermediate, or advanced levels.`;

//         console.log("Workout Plan Prompt:", prompt); // Log the prompt for debugging

//         const workoutPlan = await getGeminiResponseText(model, prompt);

//         if (workoutPlan.includes("⚠️")) {
//             return res.status(400).json({
//                 message: "Error generating workout plan",
//                 error: workoutPlan,
//             });
//         }

//         res.json({
//             message: "✅ Workout Plan Generated Successfully!",
//             workoutPlan: workoutPlan.trim(),
//         });
//     } catch (error) {
//         console.error("❌ Error generating workout plan:", error);
//         res.status(500).json({ message: "Error generating workout plan", error: error.message });
//     }
// });


// AI Nutrition Plan Endpoint

app.post('/api/ai/nutrition', async (req, res) => {
    const { fitnessGoal, age, weight, height, userId } = req.body; // Add userId to identify the user

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Construct the prompt
        const prompt = `Create a personalized nutrition plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
        - Provide a structured daily meal plan with breakfast, lunch, dinner, and snacks.
        - Include daily calorie intake, protein, carbs, and fats breakdown.
        - Suggest healthy food choices and portion sizes.`;

        console.log("Nutrition Plan Prompt:", prompt); // Log the prompt for debugging

        // Send the prompt to the Gemini API
        const nutritionPlan = await getGeminiResponseText(model, prompt);

        // Check if the response contains an error
        if (nutritionPlan.includes("⚠️")) {
            return res.status(400).json({
                message: "Error generating nutrition plan",
                error: nutritionPlan,
            });
        }

        // Update the database with the generated nutrition plan
        const user = await Helth.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.nutritionPlan = nutritionPlan.trim(); // Save the nutrition plan
        await user.save();

        // Send the response back to the client
        res.json({
            message: "✅ Nutrition Plan Generated and Saved Successfully!",
            nutritionPlan: nutritionPlan.trim(),
        });
    } catch (error) {
        console.error("❌ Error generating nutrition plan:", error);
        res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
    }
});


// app.post('/api/ai/nutrition', async (req, res) => {
//     const { fitnessGoal, age, weight, height } = req.body;

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//         // Construct the prompt
//         const prompt = `Create a personalized nutrition plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
//         - Provide a structured daily meal plan with breakfast, lunch, dinner, and snacks.
//         - Include daily calorie intake, protein, carbs, and fats breakdown.
//         - Suggest healthy food choices and portion sizes.`;

//         console.log("Nutrition Plan Prompt:", prompt); // Log the prompt for debugging

//         // Send the prompt to the Gemini API
//         const nutritionPlan = await getGeminiResponseText(model, prompt);

//         // Check if the response contains an error
//         if (nutritionPlan.includes("⚠️")) {
//             return res.status(400).json({
//                 message: "Error generating nutrition plan",
//                 error: nutritionPlan,
//             });
//         }

//         // Send the response back to the client
//         res.json({
//             message: "✅ Nutrition Plan Generated Successfully!",
//             nutritionPlan: nutritionPlan.trim(),
//         });
//     } catch (error) {
//         console.error("❌ Error generating nutrition plan:", error);
//         res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
//     }
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// app.post('/api/ai/nutrition', async (req, res) => {
//     const { fitnessGoal, age, weight, height } = req.body;

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//         const prompt = `Create a personalized nutrition plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
//         - Provide a structured daily meal plan with breakfast, lunch, dinner, and snacks.
//         - Include daily calorie intake, protein, carbs, and fats breakdown.
//         - Suggest healthy food choices and portion sizes.`;

//         const nutritionPlan = await getGeminiResponseText(model, prompt);

//         res.json({
//             message: "✅ Nutrition Plan Generated Successfully!",
//             nutritionPlan: nutritionPlan.trim(),
//         });
//     } catch (error) {
//         console.error("❌ Error generating nutrition plan:", error);
//         res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
//     }
// });


