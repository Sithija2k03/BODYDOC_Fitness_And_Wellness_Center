const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appoinment');

// Fetch all appointments
router.get('/', async (req, res) => {
  console.log('Received GET request to fetch all appointments');
  try {
    const appointments = await Appointment.find();
    console.log('Fetched appointments:', appointments);
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new appointment
router.post('/add', async (req, res) => {
  try {
    const { user_name, doctor_name, date, time_slot } = req.body;
    const appointment = new Appointment({
      user_name,
      doctor_name,
      date,
      time_slot,
    });
    console.log('Appointment before saving:', appointment);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update an appointment
router.put('/update/:id', async (req, res) => {
  console.log('Received PUT request to update appointment:', req.params.id);
  console.log('Request body:', req.body);

  const appointmentId = req.params.id;
  const { user_name, doctor_name, date, time_slot } = req.body;

  const updateAppointment = {
    user_name,
    doctor_name,
    date,
    time_slot,
  };

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateAppointment,
      { new: true }
    );

    if (!appointment) {
      console.log('Appointment not found for _id:', appointmentId);
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    console.log('Updated appointment:', appointment);
    res.status(200).json({ status: 'Appointment updated', appointment });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ status: 'error with updating data', error: err.message });
  }
});

// Delete an appointment
router.delete('/delete/:id', async (req, res) => {
  console.log('Received DELETE request to delete appointment:', req.params.id);
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      console.log('Appointment not found for _id:', appointmentId);
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }
    console.log('Deleted appointment:', appointment);
    res.status(200).json({ status: 'Appointment deleted' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ status: 'Failed to delete appointment', error: err.message });
  }
});


// get all appointments with all attributes
router.route("/get").get(async (req, res) => {
    try {
      // Fetch all appointments and populate all attributes
      const appointments = await Appoinment.find(); // No need for specific field selection, this fetches all fields
  
      // Check if there are appointments
      if (appointments.length > 0) {
        res.status(200).send({ status: "Appointments fetched", appointments });
      } else {
        res.status(404).send({ status: "No appointments found" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ status: "Error fetching appointments", error: err.message });
    }
  });

  // Fetch a single appointment by ID
router.get('/:id', async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      res.json(appointment);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      res.status(500).json({ error: err.message });
    }
  });
  
  
  


module.exports = router;