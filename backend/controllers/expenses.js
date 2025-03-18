const Expense = require("../models/expensesModel"); 

exports.addExpense = async (req, res) => {
    console.log("Received Body:", req.body);  

    const { title, amount, date, category, description } = req.body;

    try {
        if (!title || !amount || !category || !description || !date) {
            return res.status(400).json({ message: "All fields are required " });
        }

        const newExpense = new Expense({ title, amount, date, category, description });
        await newExpense.save();

        res.status(201).json({ message: "Expense added successfully", data: newExpense });
    } catch (error) {
        console.error("Error adding Expense:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "All expenses", data: expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

exports.deleteExpenses = async (req, res) => {
   const{id} = req.params;
   Expense.findByIdAndDelete(id)
   .then(() => res.json('Expense deleted.'))
   .catch(err => res.status(400).json('Error: ' + err));
}
