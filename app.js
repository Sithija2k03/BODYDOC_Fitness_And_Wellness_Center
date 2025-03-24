const express = require('express');
const cors = require('cors');
const { connect } = require('http2');
const connectDB = require('./backend/db/db');
const { readdirSync } = require('fs');

require('dotenv').config();

const PORT = process.env.PORT;

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
readdirSync('./backend/routes').map((r) => app.use('/api/v1', require(`./backend/routes/${r}`)));

const server = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

server();
