const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Connection Failed:', error.message); // Log detailed error
        process.exit(1); // Exit to stop the script
    }
};

module.exports = connectDB;