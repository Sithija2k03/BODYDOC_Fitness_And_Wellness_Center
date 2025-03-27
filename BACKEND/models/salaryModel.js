const mongoose = require('mongoose');
const User = require('./userModel');  // Import the User model to fetch user data

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    allowances: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    type:{
        type: String,
       default: 'salary',
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
