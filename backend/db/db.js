const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected...');
    } catch (error) {
        console.log('Connection Failed');
    }
};

module.exports = connectDB;