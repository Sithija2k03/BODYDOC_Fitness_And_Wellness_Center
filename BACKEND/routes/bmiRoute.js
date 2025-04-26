const express = require("express");
const router = express.Router();

router.post("/calculate", (req, res) => {
  const { weight, height } = req.body;

  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.status(400).json({ error: "Invalid weight or height." });
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const bmiRounded = parseFloat(bmi.toFixed(2));

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal weight";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obese";

  return res.json({ bmi: bmiRounded, category });
});

module.exports = router;
