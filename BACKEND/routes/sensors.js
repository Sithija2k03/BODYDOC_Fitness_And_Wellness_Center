const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// POST - from ESP32
router.post('/', async (req, res) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();
    res.status(201).json({ message: 'Sensor data saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - for frontend
router.get('/', async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
