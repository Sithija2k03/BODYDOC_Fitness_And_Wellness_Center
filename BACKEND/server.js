const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();
const connectDB = require('./db/db'); // Corrected file path
const User = require("./models/user.js");
const userRouter = require("./routes/users.js");
const membershipRouter = require("./routes/membershiproutes.js");
const staffRouter = require("./routes/staffroutes.js");
const bookingRouter = require("./routes/bookings.js");
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000; // Default port if env variable is missing

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transactionRouter = require("./routes/transactions.js");
app.use("/transactions", transactionRouter);

const supplierRouter = require("./routes/suppliers.js");
app.use("/supplier", supplierRouter);

const pharmacyItemRouter = require("./routes/pharmacyItems.js");
app.use("/pharmacy", pharmacyItemRouter);

// const gymEquipmentRouter = require("./routes/gymEquipments.js");
// app.use("/gym", gymEquipmentRouter);

// const inventorySummariesRouter = require("./routes/inventorySummaries.js");
// app.use("/inventorySummaries", inventorySummariesRouter);


// Fix JWT user issue (ensure it's defined)
const sampleUser = { _id: "1234567890" }; // Dummy user for testing
const token = jwt.sign({ userId: sampleUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

app.use("/user", userRouter);
app.use("/membership", membershipRouter);
app.use("/staff", staffRouter);
app.use("/booking", bookingRouter);

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

startServer();
