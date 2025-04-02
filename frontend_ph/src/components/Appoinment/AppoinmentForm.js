import React, { useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import './Appoinment.css';


const AppointmentForm = () => {
  const [userName, setUserName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({}); // State for validation errors

  const { addAppointment } = useGlobalContext();

  // Validate Form Before Submission
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    const invalidChars = /[@!~#$%^&*<>1234567890]/;
  
    if (!userName.trim()) {
      errors.userName = "User Name is required!";
      isValid = false;
    } else if (invalidChars.test(userName)) { 
      errors.userName = "User Name cannot contain @, !, #, %, ^, &, *, or numbers!";
      isValid = false;
      alert("Invalid username! Please do not use special characters or numbers."); // Alert message
    }
  
    
    if (!doctorName.trim()) {
      errors.doctorName = "Doctor Name is required!";
      isValid = false;
    } else if (invalidChars.test(doctorName)) { 
      errors.doctorName = "Doctor Name cannot contain @, !, #, %, ^, &, *, or numbers!";
      isValid = false;
      alert("Invalid doctorName! Please do not use special characters or numbers."); // Alert message
    }
  
  
  
    if (!date) {
      errors.date = "Date is required!";
      isValid = false;
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (date < today) {
        errors.date = "Date cannot be in the past!";
        isValid = false;
      }
    }
  
    if (!timeSlot) {
      errors.timeSlot = "Please select a time slot!";
      isValid = false;
    }
  
    return { isValid, errors };
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();
    if (!isValid) {
      setErrors(errors);
      return;
    }
    const formData = {
      user_name: userName,
      doctor_name: doctorName,
      time_slot: timeSlot,
      date,
    };

    try {
      await addAppointment(formData);

      // Clear form fields after successful submission
      setUserName('');
      setDoctorName('');
      setTimeSlot('');
      setDate('');
      setErrors({}); // Clear errors
      alert("Appointment booked successfully!"); // Optional success message
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="/img/bodydoc.png" alt="Logo" className="logo" />
      </div>
      <h2 className="form-heading">Book Your Appointment at BodyDoc.</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* User Name */}
        <label htmlFor="user_name">User Name:</label>
        <input
          type="text"
          className={`form-control ${errors.userName ? 'error-border' : ''}`}
          id="user_name"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        {errors.userName && <span className="error-text">{errors.userName}</span>}

        {/* Doctor Name */}
        <label htmlFor="doctor_name">Doctor Name:</label>
        <input
          type="text"
          className={`form-control ${errors.doctorName ? 'error-border' : ''}`}
          id="doctor_name"
          placeholder="Enter your doctor name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          required
        />
        {errors.doctorName && <span className="error-text">{errors.doctorName}</span>}

        {/* Date */}
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          className={`form-control ${errors.date ? 'error-border' : ''}`}
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {errors.date && <span className="error-text">{errors.date}</span>}

        {/* Time Slot */}
        <label htmlFor="time_slot">Time-slot:</label>
        <select
          className={`form-control ${errors.timeSlot ? 'error-border' : ''}`}
          id="time_slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required
        >
          <option value="">Select Time</option>
          <option>09:00 AM - 10:00 AM</option>
          <option>10:00 AM - 11:00 AM</option>
          <option>11:00 AM - 12:00 PM</option>
          <option>02:00 PM - 03:00 PM</option>
          <option>03:00 PM - 04:00 PM</option>
        </select>
        {errors.timeSlot && <span className="error-text">{errors.timeSlot}</span>}

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
            <div className="button-container">
        <button className="btn btn-secondary mt-3">View My Appointments</button>
      </div>
    </div>


  );

  
};

export default AppointmentForm;
