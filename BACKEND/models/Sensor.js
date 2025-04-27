const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensor1: {
    type: String, // only level stored (Available or Non-Available)
  },
  sensor2: {
    type: String,
  },
  timestamp: Number
});

module.exports = mongoose.model('Sensor', sensorSchema);
