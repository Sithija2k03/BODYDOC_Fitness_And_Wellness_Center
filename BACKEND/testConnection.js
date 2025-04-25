require('dotenv').config(); // Load .env
const mongoose = require('mongoose');
const connectDB = require('./db/db');

const testConnection = async () => {
    try {
        await connectDB();
        console.log('Connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();