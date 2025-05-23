const Salary = require('../models/salaryModel');
const User = require('../models/user'); 

// Controller function to create salary
const createSalary = async (req, res) => {
    try {
        const { basicSalary, allowances, deductions, paymentDate, role, otHours, otRate, epfRate, etfRate } = req.body;

        // Fetch the user data based on the role
        const user = await User.findOne({ role });

        if (!user) {
            return res.status(400).json({ message: "User with specified role not found" });
        }

        // Predefined salary configuration based on role
        const salaryConfig = {
            "admin": 100000,  
            "doctor": 80000,
            "trainer": 50000,
            "pharmacist": 60000,
            "receiptionist": 40000,
            "member": 30000,  
        };

        // Get the salary based on the role from the salaryConfig
        const roleSalary = salaryConfig[user.role] || 30000;  

        // Calculate hourly rate based on the basic salary (assuming 160 work hours per month)
        const hourlyRate = roleSalary / 160;

        // Calculate OT Pay
        const otPay = otHours * hourlyRate * otRate;

        // Calculate EPF and ETF deductions
        const epfDeduction = (roleSalary + otPay) * (epfRate / 100);
        const etfDeduction = (roleSalary + otPay) * (etfRate / 100);

        // Calculate net salary after allowances, deductions, and the overtime pay
        const netSalary = roleSalary + allowances - deductions + otPay - epfDeduction - etfDeduction;

        // Create the salary record
        const salary = new Salary({
            employeeId: user._id,  
            basicSalary: roleSalary, 
            allowances,
            deductions,
            otHours,
            otRate,
            otPay,
            epfRate,
            epfDeduction,
            etfRate,
            etfDeduction,
            netSalary,
            paymentDate,
            status: 'Pending',  
        });

        // Save salary in the database
        await salary.save();
        res.status(201).json({ message: "Salary created successfully", salary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getAllSalaries = async (req, res) => {
    try {
        // Fetch all salary records from the database
        const salaries = await Salary.find().populate('employeeId', 'fullName role'); // Populate employee details like name and role

        if (salaries.length === 0) {
            return res.status(404).json({ message: "No salary records found" });
        }

        // Return the list of salaries
        res.status(200).json({ salaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateSalaryStatus = async (req, res) => {
    try {
        const { salaryId } = req.params;  // Get the salaryId from request params
        const { status } = req.body;  // Get new status from request body

        // Validate input
        if (!["Pending", "Paid"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find the salary record by its ID
        const salary = await Salary.findById(salaryId);

        if (!salary) {
            return res.status(404).json({ message: "Salary record not found" });
        }

        // Update the status dynamically
        salary.status = status;

        // Save the updated salary record
        await salary.save();

        res.status(200).json({ message: `Salary status updated to ${status}`, salary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Controller function to delete a salary by ID
const deleteSalary = async (req, res) => {
    try {
        const { salaryId } = req.params;  // Get the salaryId from request parameters

        // Find the salary by ID and delete it
        const salary = await Salary.findByIdAndDelete(salaryId);

        if (!salary) {
            return res.status(404).json({ message: "Salary record not found" });
        }

        // Return success message
        res.status(200).json({ message: "Salary record deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createSalary, getAllSalaries, updateSalaryStatus, deleteSalary };