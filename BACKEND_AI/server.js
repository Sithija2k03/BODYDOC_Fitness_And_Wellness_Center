
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
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Helth = require("./models/helth.js");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const getGeminiResponseStructured = async (model, prompt) => {
  try {
    const result = await model.generateContent(prompt);
    console.log("Full API Response:", JSON.stringify(result, null, 2));

    let textResponse;
    if (result?.response?.candidates) {
      textResponse = result.response.candidates[0]?.content?.parts?.map(part => part.text).join("\n");
    } else if (result?.candidates) {
      textResponse = result.candidates[0]?.content?.parts?.map(part => part.text).join("\n");
    } else {
      return { error: "⚠️ Unexpected response structure." };
    }

    if (!textResponse) return { error: "⚠️ No response generated." };

    console.log("Raw Text Response:", textResponse);

    const lines = textResponse.split("\n").filter(line => line.trim());
    const tableData = [];
    let currentSection = null;

    lines.forEach((line, index) => {
      if (line.match(/Week \d+/i)) {
        currentSection = line.trim().replace(/\*\*/g, ""); // Remove bold markdown
        tableData.push({ section: currentSection, rows: [] });
      } else if (line.includes("|") && !line.match(/[-]{2,}/) && currentSection) { // Only parse rows if section exists
        const parts = line.split("|").map(item => item.trim()).filter(Boolean);
        if (parts.length >= 2 && !line.match(/(Day|Meal)\s*\|\s*Details/i)) {
          const key = prompt.includes("workout") ? "day" : "meal";
          tableData.find(item => item.section === currentSection).rows.push({
            [key]: parts[0],
            details: parts[1]
          });
        }
      }
    });

    if (tableData.length > 0 && tableData.some(section => section.rows.length > 0)) {
      return tableData;
    } else {
      return [{ section: prompt.includes("workout") ? "Workout Plan" : "Nutrition Plan", rows: [], rawText: textResponse }];
    }
  } catch (error) {
    console.error("❌ Error generating AI response:", error);
    return [{ section: "Error", rows: [], error: "⚠️ AI response failed." }];
  }
};

// AI Workout Plan Endpoint
app.post('/api/ai/workout', async (req, res) => {
  const { fitnessGoal, age, weight, height, userId } = req.body;
  console.log('Workout Request Body:', req.body);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Create a structured 4-week workout plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}. 
    - Format the response as a table with columns: "Day" and "Details".
    - Include workout days, exercises, sets, reps, rest days, and progression over the 4 weeks.
    - Use markdown table syntax (e.g., | Day | Details |) for each week.
    - Ensure the plan is balanced and suitable for beginners, intermediate, or advanced levels.`;

    console.log("Workout Plan Prompt:", prompt);
    const workoutPlan = await getGeminiResponseStructured(model, prompt);
    console.log("Generated Workout Plan:", workoutPlan);

    if (workoutPlan[0]?.error) {
      console.error("Workout Plan Error Details:", workoutPlan[0].error);
      return res.status(400).json({ message: "Error generating workout plan", error: workoutPlan[0].error });
    }

    const user = await Helth.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.workoutPlan = JSON.stringify(workoutPlan);
    await user.save();

    res.json({
      message: "✅ Workout Plan Generated and Saved Successfully!",
      workoutPlan,
    });
  } catch (error) {
    console.error("❌ Error generating workout plan:", error);
    res.status(500).json({ message: "Error generating workout plan", error: error.message });
  }
});

// AI Nutrition Plan Endpoint
app.post('/api/ai/nutrition', async (req, res) => {
  const { fitnessGoal, age, weight, height, userId } = req.body;
  console.log('Nutrition Request Body:', req.body);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Create a personalized nutrition plan for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
    - Format the response strictly as a markdown table with columns "Meal" and "Details".
    - Example: | Meal | Details | 
                Breakfast	Oatmeal, 300 cal, 10g protein
                Lunch	Chicken Salad, 500 cal 
- Provide a structured daily meal plan with breakfast, lunch, dinner, and snacks.
- Include daily calorie intake, protein, carbs, and fats breakdown in the details.
- Suggest healthy food choices and portion sizes.`;

console.log("Nutrition Plan Prompt:", prompt);
const nutritionPlan = await getGeminiResponseStructured(model, prompt);
console.log("Generated Nutrition Plan:", nutritionPlan);

if (nutritionPlan[0]?.error) {
console.error("Nutrition Plan Error Details:", nutritionPlan[0].error);
return res.status(400).json({ message: "Error generating nutrition plan", error: nutritionPlan[0].error });
}

const user = await Helth.findById(userId);
if (!user) {
return res.status(404).json({ message: "User not found" });
}

user.nutritionPlan = JSON.stringify(nutritionPlan);
await user.save();

res.json({
message: "✅ Nutrition Plan Generated and Saved Successfully!",
nutritionPlan,
});
} catch (error) {
console.error("❌ Error generating nutrition plan:", error);
res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
}
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});