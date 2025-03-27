const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();
const connectDB = require('./db/db'); // Corrected file path

const PORT = process.env.PORT || 5000; // Default port if env variable is missing

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

readdirSync('./routes').forEach((file) => {  
    app.use('/api/v1', require(`./routes/${file}`));
});

const supplierRouter = require("./routes/suppliers.js");
app.use("/supplier", supplierRouter);

// const pharmacyItemRouter = require("./routes/pharmacyItems.js");
// app.use("/pharmacy", pharmacyItemRouter);

// const gymEquipmentRouter = require("./routes/gymEquipments.js");
// app.use("/gym", gymEquipmentRouter);

// const inventorySummariesRouter = require("./routes/inventorySummaries.js");
// app.use("/inventorySummaries", inventorySummariesRouter);


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
