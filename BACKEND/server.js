const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Models
const User = require("./models/user.js");
const Helth = require("./models/helth.js");

// Routes
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

const pettyCashRoutes = require('./routes/pettyCashRoutes');
const path = require('path');
const nodemailer = require('nodemailer');
const bmiRouter = require("./routes/bmiRoute.js");

// Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;
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

// // Custom middleware to set Content-Type for PDFs
// app.use('/uploads', (req, res, next) => {
//   const filePath = path.join(__dirname, 'uploads', req.path);
//   const ext = path.extname(filePath).toLowerCase();
//   if (ext === '.pdf') {
//     res.setHeader('Content-Type', 'application/pdf');
//   }
//   next();
// });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// public Routes
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
app.use('/api/petty-cash', pettyCashRoutes);

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
          headers = parts; // First row = table headers
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
- Generate EXACTLY 4 weeks of workouts.
- For each week:
  - Start with a row where the Day column is "Week X: Description" (e.g., "Week 1: Foundation").
  - Include EXACTLY the 6 days Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday in that order.
  - Do NOT include Sunday or any other days.
  - For each day, include at least one exercise (or "Rest" if a rest day).
  - Include multiple exercises per day if applicable, with one row per exercise.
- Ensure progression across weeks (e.g., increasing intensity or volume).
- Every row MUST have values (or empty strings) for Day, Exercise, Sets, Reps, and Notes columns.
- Example:
  | Day | Exercise | Sets | Reps | Notes |
  | --- | -------- | ---- | ---- | ----- |
  | Week 1: Foundation | | | | |
  | Monday | Squats | 3 | 10 | Moderate weight |
  | Monday | Push-ups | 3 | 12 | Bodyweight |
  | Tuesday | Rest | | | |
  | Wednesday | Bench Press | 3 | 10 | Light weight |
  | Thursday | Deadlifts | 3 | 8 | Focus on form |
  | Friday | Pull-ups | 3 | 8 | Assisted if needed |
  | Saturday | Rest | | | |
  | Week 2: Progression | | | | |
  | ... (continue for all 4 weeks) |
- Do not include any text outside the table.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const aiResponse = await getGeminiResponseStructured(model, prompt);
    console.log('Raw AI Response:', JSON.stringify(aiResponse, null, 2));

    let workoutPlan;

    // Handle different types of aiResponse
    if (Array.isArray(aiResponse)) {
      console.log('AI Response is an array:', aiResponse);
      workoutPlan = aiResponse.map(row => ({
        Day: row.Day || '',
        Exercise: row.Exercise || '',
        Sets: row.Sets || '',
        Reps: row.Reps || '',
        Notes: row.Notes || ''
      }));
    } else if (aiResponse.rawText && typeof aiResponse.rawText === 'string') {
      console.log('AI Response rawText:', aiResponse.rawText);
      workoutPlan = parseMarkdownTable(aiResponse.rawText);
    } else if (aiResponse.error) {
      console.error('AI response error:', aiResponse.error);
      return res.status(500).json({ message: 'Failed to generate workout plan', error: aiResponse.error });
    } else {
      console.error('Invalid AI response format:', aiResponse);
      return res.status(500).json({ message: 'Invalid AI response format' });
    }

    console.log('Parsed workoutPlan:', JSON.stringify(workoutPlan, null, 2));

    if (!workoutPlan || workoutPlan.length === 0) {
      console.error('Failed to parse workout plan from AI response');
      return res.status(500).json({ message: 'Failed to generate workout plan' });
    }

    // Week and Day validation
    let weekCount = 0;
    let currentWeekDays = new Set();
    let isValid = true;

    for (const item of workoutPlan) {
      console.log('Processing item:', item);
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
      } else {
        console.warn(`Invalid day in item: ${item.Day}`);
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
      return res.status(500).json({
        message: 'Generated workout plan does not meet requirements: must have 4 weeks with 6 days each (Monday to Saturday)'
      });
    }

    res.json({
      message: '✅ Workout Plan Generated Successfully!',
      workoutPlan
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ message: 'Error generating workout plan', error: error.message });
  }
});

// Parse Markdown Table for Workout Plan
function parseMarkdownTable(markdown) {
  if (typeof markdown !== 'string') {
    console.error('parseMarkdownTable: Expected a string, got:', markdown);
    return [];
  }

  const lines = markdown.trim().split('\n').filter(line => line.trim());
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip header or separator rows
    if (line.startsWith('| Day') || line.startsWith('| ---')) continue;

    // Parse table rows
    const parts = line.split('|').map(part => part.trim()).filter(part => part);
    if (parts.length >= 5) {
      const day = parts[0];
      // Validate day
      if (day.match(/^Week \d+:/) || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day)) {
        data.push({
          Day: day,
          Exercise: parts[1] || '',
          Sets: parts[2] || '',
          Reps: parts[3] || '',
          Notes: parts[4] || ''
        });
      } else {
        console.warn(`Skipping invalid day: ${day}`);
      }
    } else {
      console.warn(`Skipping malformed row: ${line}`);
    }
  }

  return data;
}

// AI Nutrition Plan Endpoint
app.post('/api/ai/nutrition', async (req, res) => {
  const { fitnessGoal, age, weight, height } = req.body;

  // Input validation
  if (!fitnessGoal || typeof fitnessGoal !== 'string' || fitnessGoal.trim().length < 2 || fitnessGoal.trim().length > 50) {
    return res.status(400).json({ message: 'Invalid fitness goal: must be a string between 2 and 50 characters' });
  }
  if (!age || isNaN(age) || age <= 0 || age > 120) {
    return res.status(400).json({ message: 'Invalid age: must be a number between 1 and 120' });
  }
  if (!weight || isNaN(weight) || weight <= 0 || weight > 500) {
    return res.status(400).json({ message: 'Invalid weight: must be a number between 0.1 and 500' });
  }
  if (height && (isNaN(height) || height <= 0 || height > 300)) {
    return res.status(400).json({ message: 'Invalid height: must be a number between 0.1 and 300' });
  }

  // AI prompt
  const prompt = `Create a structured **1-week nutrition plan** for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}. Height: ${height || 'unknown'}cm.
  - Format response STRICTLY as a Markdown Table:
    | Meal | Food | Calories | Protein (g) | Carbs (g) | Fats (g) |
    | ---- | ---- | -------- | ----------- | --------- | -------- |
  - Generate EXACTLY 1 week of nutrition plans. This is critical: you MUST include only 1 week.
  - For the week:
    - Start with a row where the Meal column is "Week 1: Foundation".
    - Include EXACTLY the 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, in that order. Do NOT skip any days.
    - For each day, include Breakfast, Lunch, Dinner, and 1 Snack (labeled as "Snack").
    - Each meal must have a descriptive Food entry and numerical values for Calories, Protein (g), Carbs (g), and Fats (g).
  - Every row MUST have values for Meal, Food, Calories, Protein (g), Carbs (g), and Fats (g). Use empty strings for Snacks if no snack is planned.
  - After the nutrition plan, include a section with EXACTLY 3 additional recommendations (e.g., "Stay hydrated") in a list format:
    - Recommendation 1
    - Recommendation 2
    - Recommendation 3
  - Example:
    | Meal | Food | Calories | Protein (g) | Carbs (g) | Fats (g) |
    | ---- | ---- | -------- | ----------- | --------- | -------- |
    | Week 1: Foundation | | | | | |
    | Monday Breakfast | Oatmeal (1 cup), Protein Powder (1 scoop) | 400 | 30 | 50 | 10 |
    | Monday Lunch | Chicken Breast (150g), Brown Rice (1 cup) | 500 | 40 | 60 | 15 |
    | Monday Dinner | Salmon (150g), Sweet Potato (1 medium) | 450 | 35 | 40 | 18 |
    | Monday Snack | Almonds (1/4 cup) | 200 | 5 | 5 | 15 |
    | Tuesday Breakfast | Scrambled Eggs (3), Toast (2 slices) | 350 | 20 | 30 | 15 |
    | Tuesday Lunch | Lentil Soup (1.5 cups), Whole Grain Roll | 400 | 20 | 60 | 10 |
    | Tuesday Dinner | Beef Stir-fry, Brown Rice (1 cup) | 550 | 45 | 50 | 20 |
    | Tuesday Snack | Greek Yogurt (1/2 cup) | 150 | 10 | 15 | 5 |
    | ... (continue for Wednesday to Sunday) |
    - Stay hydrated
    - Eat slowly
    - Prioritize whole foods
  - Do not include any text outside the table and the recommendations list.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const aiResponse = await getGeminiResponseStructured(model, prompt);
    console.log('Raw AI Response:', JSON.stringify(aiResponse, null, 2));

    let nutritionPlan = [];
    let tips = [];

    // Handle different types of aiResponse
    if (Array.isArray(aiResponse)) {
      console.log('AI Response is an array:', aiResponse);
      nutritionPlan = aiResponse.map(row => ({
        Meal: row.Meal || '',
        Food: row.Food || '',
        Calories: row.Calories || '',
        "Protein (g)": row['Protein (g)'] || '',
        "Carbs (g)": row['Carbs (g)'] || '',
        "Fats (g)": row['Fats (g)'] || ''
      }));
      // Default tips if none provided
      tips = ["Stay hydrated", "Eat slowly", "Prioritize whole foods"];
    } else if (aiResponse.rawText && typeof aiResponse.rawText === 'string') {
      console.log('AI Response rawText:', aiResponse.rawText);
      const [tableText, tipsText] = aiResponse.rawText.split('\n- ');
      nutritionPlan = parseMarkdownTableNutrition(tableText);
      console.log('Parsed nutritionPlan:', JSON.stringify(nutritionPlan, null, 2));
      tips = tipsText ? tipsText.split('\n- ').map(tip => tip.trim()).filter(tip => tip) : [];
      if (tips.length === 0) {
        console.warn('No tips found in AI response, using default tips.');
        tips = ["Stay hydrated", "Eat slowly", "Prioritize whole foods"];
      }
    } else if (aiResponse.error) {
      console.error('AI response error:', aiResponse.error);
      if (aiResponse.error.includes('429')) {
        console.warn('⚠️ Google Generative AI quota exceeded. Using mock nutrition plan.');
        nutritionPlan = [
          {
            Meal: "Week 1: Foundation",
            Food: "",
            Calories: "",
            "Protein (g)": "",
            "Carbs (g)": "",
            "Fats (g)": ""
          },
          {
            Meal: "Monday Breakfast",
            Food: "Oatmeal (1 cup), Milk (1 cup), Banana",
            Calories: "350",
            "Protein (g)": "15",
            "Carbs (g)": "60",
            "Fats (g)": "8"
          },
          {
            Meal: "Monday Lunch",
            Food: "Chicken Breast (150g), Brown Rice (1 cup), Steamed Vegetables",
            Calories: "500",
            "Protein (g)": "40",
            "Carbs (g)": "60",
            "Fats (g)": "15"
          },
          {
            Meal: "Monday Dinner",
            Food: "Salmon (120g), Sweet Potato (1 medium), Broccoli",
            Calories: "450",
            "Protein (g)": "35",
            "Carbs (g)": "40",
            "Fats (g)": "18"
          },
          {
            Meal: "Monday Snack",
            Food: "Almonds (1/4 cup), Apple",
            Calories: "200",
            "Protein (g)": "5",
            "Carbs (g)": "20",
            "Fats (g)": "15"
          },
          {
            Meal: "Tuesday Breakfast",
            Food: "Scrambled Eggs (3), Whole Wheat Toast (2 slices), Avocado (1/4)",
            Calories: "400",
            "Protein (g)": "25",
            "Carbs (g)": "30",
            "Fats (g)": "20"
          },
          {
            Meal: "Tuesday Lunch",
            Food: "Lentil Soup (1.5 cups), Whole Grain Roll",
            Calories: "450",
            "Protein (g)": "20",
            "Carbs (g)": "70",
            "Fats (g)": "10"
          },
          {
            Meal: "Tuesday Dinner",
            Food: "Ground Beef Stir-fry with Brown Rice and Mixed Vegetables",
            Calories: "550",
            "Protein (g)": "45",
            "Carbs (g)": "50",
            "Fats (g)": "25"
          },
          {
            Meal: "Tuesday Snack",
            Food: "Greek Yogurt (1/2 cup), Honey (1 tsp)",
            Calories: "150",
            "Protein (g)": "10",
            "Carbs (g)": "15",
            "Fats (g)": "5"
          },
          {
            Meal: "Wednesday Breakfast",
            Food: "Greek Yogurt (1 cup), Berries (1/2 cup), Almonds (1/4 cup)",
            Calories: "300",
            "Protein (g)": "20",
            "Carbs (g)": "30",
            "Fats (g)": "15"
          },
          {
            Meal: "Wednesday Lunch",
            Food: "Tuna Salad Sandwich on Whole Wheat Bread, Apple",
            Calories: "400",
            "Protein (g)": "30",
            "Carbs (g)": "50",
            "Fats (g)": "12"
          },
          {
            Meal: "Wednesday Dinner",
            Food: "Chicken and Vegetable Curry with Brown Rice",
            Calories: "500",
            "Protein (g)": "40",
            "Carbs (g)": "60",
            "Fats (g)": "15"
          },
          {
            Meal: "Wednesday Snack",
            Food: "Protein Bar",
            Calories: "200",
            "Protein (g)": "15",
            "Carbs (g)": "20",
            "Fats (g)": "8"
          },
          {
            Meal: "Thursday Breakfast",
            Food: "Smoothie (Protein Powder, Banana, Spinach, Almond Milk)",
            Calories: "350",
            "Protein (g)": "30",
            "Carbs (g)": "40",
            "Fats (g)": "10"
          },
          {
            Meal: "Thursday Lunch",
            Food: "Leftover Chicken and Vegetable Curry",
            Calories: "500",
            "Protein (g)": "40",
            "Carbs (g)": "60",
            "Fats (g)": "15"
          },
          {
            Meal: "Thursday Dinner",
            Food: "Pasta with Marinara Sauce, Ground Turkey, Vegetables",
            Calories: "550",
            "Protein (g)": "45",
            "Carbs (g)": "70",
            "Fats (g)": "20"
          },
          {
            Meal: "Thursday Snack",
            Food: "Mixed Nuts (1/4 cup)",
            Calories: "180",
            "Protein (g)": "5",
            "Carbs (g)": "10",
            "Fats (g)": "15"
          },
          {
            Meal: "Friday Breakfast",
            Food: "Pancakes (2), Maple Syrup, Berries",
            Calories: "400",
            "Protein (g)": "15",
            "Carbs (g)": "70",
            "Fats (g)": "10"
          },
          {
            Meal: "Friday Lunch",
            Food: "Salad with Grilled Chicken, Avocado, and Quinoa",
            Calories: "450",
            "Protein (g)": "35",
            "Carbs (g)": "40",
            "Fats (g)": "20"
          },
          {
            Meal: "Friday Dinner",
            Food: "Pizza (2 slices), Side Salad",
            Calories: "600",
            "Protein (g)": "30",
            "Carbs (g)": "80",
            "Fats (g)": "25"
          },
          {
            Meal: "Friday Snack",
            Food: "Cottage Cheese (1/2 cup), Pineapple (1/2 cup)",
            Calories: "150",
            "Protein (g)": "10",
            "Carbs (g)": "15",
            "Fats (g)": "5"
          },
          {
            Meal: "Saturday Breakfast",
            Food: "Waffles (2), Peanut Butter, Banana",
            Calories: "450",
            "Protein (g)": "20",
            "Carbs (g)": "60",
            "Fats (g)": "20"
          },
          {
            Meal: "Saturday Lunch",
            Food: "Burgers (1), Sweet Potato Fries",
            Calories: "650",
            "Protein (g)": "40",
            "Carbs (g)": "70",
            "Fats (g)": "30"
          },
          {
            Meal: "Saturday Dinner",
            Food: "Steak (150g), Baked Potato, Green Beans",
            Calories: "600",
            "Protein (g)": "50",
            "Carbs (g)": "50",
            "Fats (g)": "30"
          },
          {
            Meal: "Saturday Snack",
            Food: "Protein Shake (1 scoop), Almond Milk",
            Calories: "200",
            "Protein (g)": "25",
            "Carbs (g)": "10",
            "Fats (g)": "5"
          },
          {
            Meal: "Sunday Breakfast",
            Food: "Omelette (3 eggs, cheese, vegetables)",
            Calories: "400",
            "Protein (g)": "25",
            "Carbs (g)": "20",
            "Fats (g)": "25"
          },
          {
            Meal: "Sunday Lunch",
            Food: "Roast Chicken, Roasted Vegetables, Potatoes",
            Calories: "600",
            "Protein (g)": "50",
            "Carbs (g)": "60",
            "Fats (g)": "25"
          },
          {
            Meal: "Sunday Dinner",
            Food: "Leftover Roast Chicken and Vegetables",
            Calories: "500",
            "Protein (g)": "40",
            "Carbs (g)": "50",
            "Fats (g)": "20"
          },
          {
            Meal: "Sunday Snack",
            Food: "Dark Chocolate (1 oz), Walnuts (1/4 cup)",
            Calories: "200",
            "Protein (g)": "5",
            "Carbs (g)": "15",
            "Fats (g)": "15"
          }
        ];
        tips = ["Stay hydrated", "Eat slowly", "Prioritize whole foods"];
      } else {
        return res.status(500).json({ message: 'Failed to generate nutrition plan', error: aiResponse.error });
      }
    } else {
      console.error('Invalid AI response format:', aiResponse);
      return res.status(500).json({ message: 'Invalid AI response format' });
    }

    // Validate weeks and days
    let weekCount = 0;
    let currentWeekDays = new Set();
    let isValid = true;

    for (const item of nutritionPlan) {
      if (item.Meal.match(/^Week \d+:/)) {
        if (currentWeekDays.size > 0) {
          if (currentWeekDays.size !== 7 || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].every(day => currentWeekDays.has(day))) {
            console.error(`Week ${weekCount} does not have exactly 7 days (Monday to Sunday):`, Array.from(currentWeekDays));
            isValid = false;
          }
        }
        weekCount++;
        currentWeekDays = new Set();
      } else if (item.Meal.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/)) {
        const day = item.Meal.split(' ')[0];
        currentWeekDays.add(day);
      }
    }

    if (currentWeekDays.size > 0) {
      if (currentWeekDays.size !== 7 || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].every(day => currentWeekDays.has(day))) {
        console.error(`Week ${weekCount} does not have exactly 7 days (Monday to Sunday):`, Array.from(currentWeekDays));
        isValid = false;
      }
    }

    if (weekCount !== 1) {
      console.error(`Expected 1 week, but found ${weekCount} weeks`);
      isValid = false;
    }

    if (!isValid) {
      return res.status(500).json({
        message: 'Generated nutrition plan does not meet requirements: must have 1 week with 7 days (Monday to Sunday)'
      });
    }

    // Calculate totals (excluding Week header rows)
    const totals = { Calories: 0, "Protein (g)": 0, "Carbs (g)": 0, "Fats (g)": 0 };
    nutritionPlan.forEach(item => {
      if (!item.Meal.match(/^Week \d+:/) && item.Meal !== '**Totals**') {
        totals.Calories += parseFloat(item.Calories) || 0;
        totals["Protein (g)"] += parseFloat(item["Protein (g)"]) || 0;
        totals["Carbs (g)"] += parseFloat(item["Carbs (g)"]) || 0;
        totals["Fats (g)"] += parseFloat(item["Fats (g)"]) || 0;
      }
    });

    // Round totals to nearest whole number
    totals.Calories = Math.round(totals.Calories);
    totals["Protein (g)"] = Math.round(totals["Protein (g)"]);
    totals["Carbs (g)"] = Math.round(totals["Carbs (g)"]);
    totals["Fats (g)"] = Math.round(totals["Fats (g)"]);

    // Add totals row
    nutritionPlan.push({
      Meal: '**Totals**',
      Food: '',
      Calories: totals.Calories.toString(),
      "Protein (g)": totals["Protein (g)"].toString(),
      "Carbs (g)": totals["Carbs (g)"].toString(),
      "Fats (g)": totals["Fats (g)"].toString()
    });

    // Return the response
    return res.status(200).json({
      message: '✅ Nutrition Plan Generated Successfully!',
      nutritionPlan,
      tips
    });
  } catch (error) {
    console.error('Error in /api/ai/nutrition:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Updated parseMarkdownTable function for Nutrition
function parseMarkdownTableNutrition(markdown) {
  if (typeof markdown !== 'string') {
    console.error('parseMarkdownTableNutrition: Expected a string, got:', markdown);
    return [];
  }

  const lines = markdown.trim().split('\n').filter(line => line.trim());
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip header or separator rows
    if (line.startsWith('| Meal') || line.startsWith('| ---')) continue;

    // Parse table rows
    const parts = line.split('|').map(part => part.trim()).filter(part => part);
    if (parts.length >= 6) {
      const meal = parts[0];
      // Validate meal
      if (meal.match(/^Week \d+:/) || meal.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(Breakfast|Lunch|Dinner|Snack)/)) {
        data.push({
          Meal: meal,
          Food: parts[1] || '',
          Calories: parts[2] || '',
          "Protein (g)": parts[3] || '',
          "Carbs (g)": parts[4] || '',
          "Fats (g)": parts[5] || ''
        });
      } else {
        console.warn(`Skipping invalid meal: ${meal}`);
      }
    } else {
      console.warn(`Skipping malformed row: ${line}`);
    }
  }

  return data;
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});