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


exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().sort({ createdAt: -1 });
        
        if (incomes.length === 0) {
            return res.status(404).json({ message: "No incomes found" });
        }

        res.status(200).json({ message: "All incomes", data: incomes });
    } catch (error) {
        console.error("Error fetching incomes:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


exports.deleteIncome = async (req, res) => {
   const{id} = req.params;
   Income.findByIdAndDelete(id)
   .then(() => res.json('Income deleted.'))
   .catch(err => res.status(400).json('Error: ' + err));
}
