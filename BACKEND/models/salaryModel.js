const mongoose = require('mongoose');

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
    otHours: {
        type: Number,
        default: 0, // Overtime hours
    },
    otRate: {
        type: Number,
        default: 1.5, // Default OT rate multiplier (1.5x basic hourly rate)
    },
    otPay: {
        type: Number,
        default: 0, // Auto-calculated overtime pay
    },
    epfRate: {
        type: Number,
        default: 8, // Default EPF rate (can be changed)
    },
    epfDeduction: {
        type: Number,
        default: 0, // Auto-calculated EPF deduction
    },
    etfRate: {
        type: Number,
        default: 3, // Default ETF rate (can be changed)
    },
    etfDeduction: {
        type: Number,
        default: 0, // Auto-calculated ETF deduction
    },
    netSalary: {
        type: Number,
        required: true,
    },
    type: {
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

// Pre-save Hook to Auto-calculate OT Pay, EPF, ETF, and Net Salary
salarySchema.pre('save', function (next) {
    // Calculate hourly rate
    const hourlyRate = this.basicSalary / 160; // Assuming 160 work hours per month

    // Calculate OT Pay
    this.otPay = this.otHours * hourlyRate * this.otRate;

    // Calculate EPF & ETF deductions
    this.epfDeduction = (this.basicSalary + this.otPay) * (this.epfRate / 100);
    this.etfDeduction = (this.basicSalary + this.otPay) * (this.etfRate / 100);

    // Calculate Net Salary
    this.netSalary = 
        this.basicSalary + 
        this.otPay + 
        this.allowances - 
        (this.deductions + this.epfDeduction + this.etfDeduction);

    next();
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;

