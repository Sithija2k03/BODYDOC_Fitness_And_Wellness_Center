const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// POST - from ESP32
router.post("/", async (req, res) => {
    try {
        const { sensor1, sensor2, timestamp } = req.body;

        const newSensorData = new Sensor({
            sensor1: sensor1.level,   // Save only the level (string)
            sensor2: sensor2.level,   // Save only the level (string)
            timestamp: timestamp
        });

        await newSensorData.save();
        res.status(201).json({ message: "Sensor data saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET - Always fetch the latest sensor data
router.get("/latest", async (req, res) => {
    try {
        const latestData = await Sensor.findOne().sort({ timestamp: -1 }); // Sort by timestamp DESC
        
        if (!latestData) {
            return res.status(404).json({ message: "No sensor data found" });
        }

        res.status(200).json(latestData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
