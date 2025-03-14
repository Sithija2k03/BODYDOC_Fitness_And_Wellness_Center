const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50  
    },
    amount: {
        type: Number,
        required: true,
        trim: true  
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200  
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
