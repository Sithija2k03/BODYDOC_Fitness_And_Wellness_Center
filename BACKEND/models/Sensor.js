const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensor1: {
    status: String,
    distance: Number
  },
  sensor2: {
    status: String,
    distance: Number
  },
  timestamp: Number
});

module.exports = mongoose.model('Sensor', sensorSchema);
