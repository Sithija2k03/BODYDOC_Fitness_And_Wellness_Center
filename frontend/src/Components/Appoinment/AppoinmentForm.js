import React, { useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { useNavigate } from "react-router-dom";
import Button from "../AppoinmentLayout/Button";
import Header from '../../Login/Header';

const containerStyle = {
  width: '400px',
  margin: '50px auto',
  padding: '30px',
  background: '#bab2b2',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {
  width: '150px',
  height: 'auto',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
};

const buttonStyle = {
  backgroundColor: '#F56692',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
};

const buttonHoverStyle = {
  backgroundColor: '#dd275e',
};

const errorTextStyle = {
  color: 'red',
  fontSize: '14px',
  marginBottom: '10px',
};

const errorBorderStyle = {
  border: '1px solid red',
};

const AppointmentForm = () => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  const { addAppointment } = useGlobalContext();

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
      alert("Invalid username! Please do not use special characters or numbers.");
    }

    if (!doctorName.trim()) {
      errors.doctorName = "Doctor Name is required!";
      isValid = false;
    } else if (invalidChars.test(doctorName)) {
      errors.doctorName = "Doctor Name cannot contain @, !, #, %, ^, &, *, or numbers!";
      isValid = false;
      alert("Invalid doctorName! Please do not use special characters or numbers.");
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
      date,
      time_slot: timeSlot,
    };

    try {
      await addAppointment(formData);
      setUserName('');
      setDoctorName('');
      setTimeSlot('');
      setDate('');
      setErrors({});
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <>
    <Header/>
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/img/bodydoc.png" alt="Logo" style={logoStyle} />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Book Your Appointment at BodyDoc.</h2>

      <form onSubmit={handleSubmit} noValidate style={formStyle}>
        <label htmlFor="user_name" style={labelStyle}>User Name:</label>
        <input
          type="text"
          id="user_name"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ 
            ...inputStyle, 
            ...(errors.userName ? errorBorderStyle : {}) 
          }}
        />
        {errors.userName && <span style={errorTextStyle}>{errors.userName}</span>}

        <label htmlFor="doctor_name" style={labelStyle}>Doctor Name:</label>
        <input
          type="text"
          id="doctor_name"
          placeholder="Enter your doctor name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          style={{ 
            ...inputStyle, 
            ...(errors.doctorName ? errorBorderStyle : {}) 
          }}
        />
        {errors.doctorName && <span style={errorTextStyle}>{errors.doctorName}</span>}

        <label htmlFor="date" style={labelStyle}>Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            ...inputStyle, 
            ...(errors.date ? errorBorderStyle : {}) 
          }}
        />
        {errors.date && <span style={errorTextStyle}>{errors.date}</span>}

        <label htmlFor="time_slot" style={labelStyle}>Time-slot:</label>
        <select
          id="time_slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          style={{
            ...inputStyle,
            ...(errors.timeSlot ? errorBorderStyle : {})
          }}
        >
          <option value="">Select Time</option>
          <option>09:00 AM - 10:00 AM</option>
          <option>10:00 AM - 11:00 AM</option>
          <option>11:00 AM - 12:00 PM</option>
          <option>02:00 PM - 03:00 PM</option>
          <option>03:00 PM - 04:00 PM</option>
        </select>
        {errors.timeSlot && <span style={errorTextStyle}>{errors.timeSlot}</span>}

        <button
          type="submit"
          style={isHovering ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Submit
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
      <Button onClick={() => navigate("/appointment-display")}>View My Appointments</Button>
      </div>
    </div>
    </>
  );
};

export default AppointmentForm;
