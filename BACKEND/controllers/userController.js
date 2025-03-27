import User from '../models/userModel.js';

export const getEmployeeByRole = async (req, res) => {
    const { role } = req.query; // Get role from query parameters

    try {
        const employee = await User.findOne({ role }); // Fetch the first user with the selected role
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};