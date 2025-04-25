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
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors());
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
    const result = await model.generateContent(prompt);
    let textResponse = result?.candidates?.[0]?.content?.parts?.map(part => part.text).join("\n") || "";
    if (!textResponse) return { error: "⚠️ No response generated." };

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
    console.error("❌ Error generating AI response:", error);
    return { error: "⚠️ AI response failed." };
  }
};

// AI Workout Plan Endpoint
app.post('/api/ai/workout', async (req, res) => {
  const { fitnessGoal, age, weight, userId } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Create a structured **4-week workout plan** for a ${age}-year-old, ${weight}kg individual with a goal of ${fitnessGoal}.
- Format response STRICTLY as a Markdown Table:
  | Day | Exercise | Sets | Reps | Notes |
  | --- | -------- | ---- | ---- | ----- |
- Include workout days, rest days, and progression.`;
    
    const workoutPlan = await getGeminiResponseStructured(model, prompt);
    if (workoutPlan.error) return res.status(400).json({ message: "Error generating workout plan", error: workoutPlan.error });

    const user = await Helth.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.workoutPlan = JSON.stringify(workoutPlan);
    await user.save();
    res.json({ message: "✅ Workout Plan Generated Successfully!", workoutPlan });
  } catch (error) {
    res.status(500).json({ message: "Error generating workout plan", error: error.message });
  }
});

// AI Nutrition Plan Endpoint
app.post('/api/ai/nutrition', async (req, res) => {
  const { fitnessGoal, age, weight, userId } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Create a personalized **nutrition plan** for a ${age}-year-old, ${weight}kg individual.
- Format response STRICTLY as a Markdown Table:
  | Meal | Food | Calories | Protein (g) | Carbs (g) | Fats (g) |
  | ---- | ---- | -------- | ----------- | --------- | -------- |
- Include **Breakfast, Lunch, Dinner, Snacks**, and nutrient breakdown.`;
    
    const nutritionPlan = await getGeminiResponseStructured(model, prompt);
    if (nutritionPlan.error) return res.status(400).json({ message: "Error generating nutrition plan", error: nutritionPlan.error });

    const user = await Helth.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.nutritionPlan = JSON.stringify(nutritionPlan);
    await user.save();
    res.json({ message: "✅ Nutrition Plan Generated Successfully!", nutritionPlan });
  } catch (error) {
    res.status(500).json({ message: "Error generating nutrition plan", error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
