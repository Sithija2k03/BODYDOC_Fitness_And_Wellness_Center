const Income = require("../models/incomeModel"); 

exports.addIncome = async (req, res) => {
    console.log("Received Body:", req.body);  // Debugging step

    const { title, amount, date, category, description } = req.body;

    try {
        if (!title || !amount || !category || !description || !date) {
            return res.status(400).json({ message: "All fields are required " });
        }

        const newIncome = new Income({ title, amount, date, category, description });
        await newIncome.save();

        res.status(201).json({ message: "Income added successfully", data: newIncome });
    } catch (error) {
        console.error("Error adding income:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

