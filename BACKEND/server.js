const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();
const connectDB = require('./db/db');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require("./models/user.js");
const Helth = require("./models/helth.js");

const userRouter = require("./routes/users.js");
const membershipRouter = require("./routes/membershiproutes.js");
const staffRouter = require("./routes/staffroutes.js");
const bookingRouter = require("./routes/bookings.js");
const transactionRouter = require("./routes/transactions.js");
const appoinmentRouter = require("./routes/appoinment.js");
const orderRouter = require("./routes/order.js");
const supplierRouter = require("./routes/suppliers.js");
const pharmacyItemRouter = require("./routes/pharmacyItems.js");
const gymEquipmentRouter = require("./routes/gymEquipments.js");

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 4000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Dummy JWT user for testing
const sampleUser = { _id: "1234567890" };
const token = jwt.sign({ userId: sampleUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register Routes
app.use("/user", userRouter);
app.use("/membership", membershipRouter);
app.use("/staff", staffRouter);
app.use("/booking", bookingRouter);
app.use("/transactions", transactionRouter);
app.use("/appoinments", appoinmentRouter);
app.use("/order", orderRouter);
app.use("/supplier", supplierRouter);
app.use("/pharmacy", pharmacyItemRouter);
app.use("/gym", gymEquipmentRouter);

// In server.js, add a test route
app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "test@example.com",
      subject: "Test Email",
      text: "This is a test email."
    });
    res.json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: "Email failed", error: error.message });
  }
});

// AI Response Parsing Helper
const getGeminiResponseStructured = async (model, prompt) => {
  try {
    console.log('Generating AI response with prompt:', prompt);
    const result = await model.generateContent(prompt);
    console.log('Raw Gemini response:', JSON.stringify(result, null, 2));

    // Safely access response
    const textResponse = result?.response?.text?.() || '';
    if (!textResponse) {
      console.error('No text response from Gemini');
      return { error: "⚠️ No response generated." };
    }

    console.log("Parsed AI Response:", textResponse);

    console.log("Raw AI Response:", textResponse);
    
    const lines = textResponse.split("\n").filter(line => line.trim());
    const tableData = [];
    let headers = [];

    lines.forEach(line => {
      if (line.includes("|") && !line.includes("---")) {
        const parts = line.split("|").map(part => part.trim()).filter(Boolean);
        if (!headers.length) {
          headers = parts;
        } else {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = parts[index] || "";
          });
          tableData.push(row);
        }
      }
    });

    return tableData.length > 0 ? tableData : { rawText: textResponse };
  } catch (error) {
    console.error("❌ Error generating AI response:", error.message, error.stack);
    return { error: `⚠️ AI response failed: ${error.message}` };
  }
};

// AI Workout Plan Endpoint

app.post('/api/ai/workout', async (req, res) => {
  try {
    const { fitnessGoal, age, weight, height } = req.body;

    if (!fitnessGoal || !age || !weight) {
      return res.status(400).json({ message: 'Missing required fields: fitnessGoal, age, weight' });
    }

    const prompt = `Create a structured **4-week workout plan** for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}. Height: ${height || 'unknown'}cm.
- Format response STRICTLY as a Markdown Table:
  | Day | Exercise | Sets | Reps | Notes |
  | --- | -------- | ---- | ---- | ----- |
- Create exactly 4 weeks of workouts.
- For each week:
  - Start with a row like "Weekend X: Description" (e.g., "Week 1: Foundation").
  - Include ONLY the days Monday to Saturday (6 days). Do NOT include Sunday.
  - For each day, include at least one exercise (or "Rest" if a rest day).
  - Include multiple exercises per day if applicable, with one row per exercise.
- Include workout days, rest days, and progression.
- Ensure every row has a Day, Exercise, Sets, Reps, and Notes column, even if some values are empty.`;

    const aiResponse = await getGeminiResponseStructured(prompt);
    console.log('Raw AI Response:', aiResponse);

    const workoutPlan = aiResponse
      .filter(row => row.Day && row.Day !== 'Sunday') // Exclude Sunday entries
      .map(row => ({
        Day: row.Day.replace(/\*\*/g, '').trim(), // Remove Markdown bold markers
        Exercise: row.Exercise || '',
        Sets: row.Sets || '',
        Reps: row.Reps || '',
        Notes: row.Notes || ''
      }));

    if (!workoutPlan || workoutPlan.length === 0) {
      console.error('Failed to parse workout plan from AI response');
      return res.status(500).json({ message: 'Failed to generate workout plan' });
    }

    let weekCount = 0;
    let currentWeekDays = new Set();
    let isValid = true;

    for (const item of workoutPlan) {
      if (item.Day.match(/^Week \d+/)) {
        if (currentWeekDays.size > 0) {
          if (currentWeekDays.size !== 6 || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].every(day => currentWeekDays.has(day))) {
            console.error(`Week ${weekCount} does not have exactly 6 days (Monday to Saturday):`, Array.from(currentWeekDays));
            isValid = false;
          }
        }
        weekCount++;
        currentWeekDays = new Set();
      } else if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(item.Day)) {
        currentWeekDays.add(item.Day);
      }
    }

    if (currentWeekDays.size > 0) {
      if (currentWeekDays.size !== 6 || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].every(day => currentWeekDays.has(day))) {
        console.error(`Week ${weekCount} does not have exactly 6 days (Monday to Saturday):`, Array.from(currentWeekDays));
        isValid = false;
      }
    }

    if (weekCount !== 4) {
      console.error(`Expected 4 weeks, but found ${weekCount} weeks`);
      isValid = false;
    }

    if (!isValid) {
      return res.status(500).json({ message: 'Generated workout plan does not meet requirements: must have 4 weeks with 6 days each (Monday to Saturday)' });
    }

    res.json({
      message: '✅ Workout Plan Generated Successfully!',
      workoutPlan
    });
  } catch (error) {
    console.error('Error generating workout plan:', error.message);
    res.status(500).json({ message: 'Error generating workout plan', error: error.message });
  }
});



// // // AI Nutrition Plan Endpoint
// app.post('/api/ai/nutrition', async (req, res) => {
//   const { fitnessGoal, age, weight, height, userId } = req.body;
//   console.log('Nutrition request body:', req.body);

//   try {
//     // Validate input
//     if (!fitnessGoal || !age || !weight || !userId) {
//       return res.status(400).json({ message: "Missing required fields: fitnessGoal, age, weight, userId" });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const prompt = `Create a personalized **nutrition plan** for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}. Height: ${height || 'unknown'}cm.
// - Format response STRICTLY as a Markdown Table:
//   | Meal | Food | Calories | Protein (g) | Carbs (g) | Fats (g) |
//   | ---- | ---- | -------- | ----------- | --------- | -------- |
// - Include **Breakfast, Lunch, Dinner, Snacks**, and nutrient breakdown.`;

//     const nutritionPlan = await getGeminiResponseStructured(model, prompt);
//     if (nutritionPlan.error) {
//       return res.status(400).json({ message: "Error generating nutrition plan", error: nutritionPlan.error });
//     }

//     const user = await Helth.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.nutritionPlan = JSON.stringify(nutritionPlan);
//     await user.save();

//     res.json({ message: "✅ Nutrition Plan Generated Successfully!", nutritionPlan });
//   } catch (error) {
//     console.error('Nutrition endpoint error:', error.message, error.stack);
//     res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
//   }
// });


// AI Nutrition Plan Endpoint
app.post('/api/ai/nutrition', async (req, res) => {
  const { fitnessGoal, age, weight, height, userId } = req.body;
  console.log('Nutrition request body:', req.body);

  try {
    // Validate input
    if (!fitnessGoal || !age || !weight || !userId) {
      return res.status(400).json({ message: "Missing required fields: fitnessGoal, age, weight, userId" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Create a personalized **nutrition plan** for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}. Height: ${height || 'unknown'}cm.
- Format response STRICTLY as a Markdown Table:
  | Meal | Food | Calories | Protein (g) | Carbs (g) | Fats (g) |
  | ---- | ---- | -------- | ----------- | --------- | -------- |
- Include **Breakfast, Lunch, Dinner, Snacks**, and nutrient breakdown.`;

    let nutritionPlan = await getGeminiResponseStructured(model, prompt);

    // Handle quota exceeded error with a mock nutrition plan
    if (nutritionPlan.error && nutritionPlan.error.includes('429 Too Many Requests')) {
      console.warn('⚠️ Google Generative AI quota exceeded. Using mock nutrition plan.');
      nutritionPlan = [
        {
          Meal: "**Breakfast**",
          Food: "Oatmeal (1 cup) with Protein Powder (1 scoop), Berries (1/2 cup), Nuts (1/4 cup)",
          Calories: "450",
          "Protein (g)": "35",
          "Carbs (g)": "50",
          "Fats (g)": "15"
        },
        {
          Meal: "**Lunch**",
          Food: "Chicken Breast (150g), Brown Rice (1 cup), Mixed Vegetables (1 cup)",
          Calories: "550",
          "Protein (g)": "45",
          "Carbs (g)": "60",
          "Fats (g)": "15"
        },
        {
          Meal: "**Dinner**",
          Food: "Salmon (150g), Sweet Potato (1 medium), Broccoli (1 cup)",
          Calories: "600",
          "Protein (g)": "40",
          "Carbs (g)": "60",
          "Fats (g)": "25"
        },
        {
          Meal: "**Snack 1**",
          Food: "Greek Yogurt (1 cup) with Fruit (1/2 cup)",
          Calories: "200",
          "Protein (g)": "20",
          "Carbs (g)": "20",
          "Fats (g)": "5"
        },
        {
          Meal: "**Snack 2**",
          Food: "Hard-boiled Eggs (2) and Almonds (1/4 cup)",
          Calories: "200",
          "Protein (g)": "15",
          "Carbs (g)": "5",
          "Fats (g)": "15"
        },
        {
          Meal: "**Totals**",
          Calories: "2000",
          "Protein (g)": "155",
          "Carbs (g)": "195",
          "Fats (g)": "75"
        }
      ];
    }

    // Handle other AI response errors
    if (nutritionPlan.error) {
      return res.status(400).json({ message: "Error generating nutrition plan", error: nutritionPlan.error });
    }

    // Filter out empty meal entries
    const validMeals = nutritionPlan.filter(
      (item) => item.Meal && item.Meal.trim() !== '' && item.Meal !== '**Totals**'
    );

    // Calculate totals
    const totals = {
      Meal: "**Totals**",
      Calories: String(
        validMeals.reduce(
          (sum, item) => sum + parseInt(item.Calories?.replace('~', '') || 0),
          0
        )
      ),
      "Protein (g)": String(
        validMeals.reduce(
          (sum, item) => sum + parseInt(item['Protein (g)']?.replace('~', '') || 0),
          0
        )
      ),
      "Carbs (g)": String(
        validMeals.reduce(
          (sum, item) => sum + parseInt(item['Carbs (g)']?.replace('~', '') || 0),
          0
        )
      ),
      "Fats (g)": String(
        validMeals.reduce(
          (sum, item) => sum + parseInt(item['Fats (g)']?.replace('~', '') || 0),
          0
        )
      ),
    };

    // Combine valid meals and totals
    const finalNutritionPlan = [...validMeals, totals];

    const user = await Helth.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.nutritionPlan = JSON.stringify(finalNutritionPlan);
    await user.save();

    res.json({ message: "✅ Nutrition Plan Generated Successfully!", nutritionPlan: finalNutritionPlan });
  } catch (error) {
    console.error('Nutrition endpoint error:', error.message, error.stack);
    res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
