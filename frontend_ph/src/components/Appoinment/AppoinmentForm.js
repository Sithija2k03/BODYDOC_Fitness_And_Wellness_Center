import React, { useState } from 'react'
import "./Appoinment.css";



const AppoinmentForm = () => {
  const [userName, setUserName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      user_name: userName,
      doctor_name: doctorName,
      time_slot: timeSlot,
      date,
    };

    console.log("Sending data:", formData); // Debugging

    try {
      const response = await fetch("http://localhost:5000/api/appoinment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container">
      {/* Add  Logo */}
      <div className="logo-container">
        <img src={".\components\Appoinment\bodydoc.png"} alt="Logo" className="logo" />
      </div>
      <h2 className="form-heading" >Book Your Appointment at BodyDoc.</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="user_name">User Name:</label>
        <input
          type="text"
          className="form-control"
          id="user_name"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required />

        <label htmlFor="doctor_name">Doctor Name:</label>
        <input
          type="text"
          className="form-control"
          id="doctor_name"
          placeholder="Enter your doctor name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          required />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          className="form-control"
          id="date"
          placeholder="Enter your date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required />

        <label htmlFor="time_slot">Time-slot:</label>
        <select
          className="form-control"
          id="time_slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required>
          <option value="">Select Time</option>
          <option>09:00 AM - 10:00 AM</option>
          <option>10:00 AM - 11:00 AM</option>
          <option>11:00 AM - 12:00 PM</option>
          <option>02:00 PM - 03:00 PM</option>
          <option>03:00 PM - 04:00 PM</option>
        </select>




        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  )
}

export default AppoinmentForm;
