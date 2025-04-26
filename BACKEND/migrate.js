require('dotenv').config(); // Load .env
const mongoose = require('mongoose');
const User = require('./models/user');
const Helth = require('./models/helth');
const connectDB = require('./db/db');

const migrateUserIDs = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        const helthUsers = await Helth.find({});
        for (const helthUser of helthUsers) {
            const user = await User.findOne({ email: helthUser.email });
            if (user && user.userID) {
                helthUser.userID = user.userID;
                await helthUser.save();
                console.log(`Updated Helth user ${helthUser.email} with userID ${user.userID}`);
            } else {
                console.log(`No matching User found for Helth user ${helthUser.email}`);
            }
        }
        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateUserIDs();