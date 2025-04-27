import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    facility_type: "",
    date: "",
    time_slot: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/booking/${id}`);
        const booking = res.data;

        setFormData({
          Name: booking.Name || "",
          email: booking.email || "",
          facility_type: booking.facility_type || "",
          date: booking.date?.slice(0, 10) || "",
          time_slot: booking.time_slot || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Could not load booking details.");
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional date validation before submission
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to beginning of day for accurate comparison
    
    if (selectedDate < today) {
      setError("Please select a future date for your booking.");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/booking/update/${id}`, formData);
      alert("Booking updated successfully!");
      // Navigate to user profile page instead of bookings page
      navigate("/user-profile"); // Adjust the path as needed
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking.");
    }
  };

  

  return (
    <>
      <style>
        {`
          .booking-form-container {
            max-width: 500px;
            margin: 50px auto;
            padding: 30px;
            background-color: #f4f4f4;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .booking-form-container h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #444;
          }

          .form-group input,
          .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
          }

          .submit-button {
            width: 100%;
            padding: 12px;
            background-color: #28a745;
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .submit-button:hover {
            background-color: #218838;
          }

          .error-message {
            color: red;
            text-align: center;
            margin-bottom: 15px;
          }
          
          .cancel-button {
            width: 100%;
            padding: 12px;
            background-color: #6c757d;
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s ease;
          }
          
          .cancel-button:hover {
            background-color: #5a6268;
          }
          
          .date-helper-text {
            font-size: 12px;
            color: #6c757d;
            margin-top: 4px;
          }
        `}
      </style>

      <div className="booking-form-container">
        <h2>Edit Booking</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Facility Type</label>
            <select name="facility_type" value={formData.facility_type} onChange={handleChange} required>
              <option value="">Select Facility</option>
              <option value="Gym">Gym</option>
              <option value="Swimming Pool">Swimming Pool</option>
              <option value="Badminton Court">Badminton Court</option>
              <option value="Pool Lounge">Pool Lounge</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              min={getTodayDate()} 
              required 
            />
            <div className="date-helper-text">Only future dates are allowed</div>
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <input type="time" name="time_slot" value={formData.time_slot} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-button">Update Booking</button>
          <button type="button" className="cancel-button" onClick={() => navigate("/profile")}>Cancel</button>
        </form>
      </div>
    </>
  );
};

export default EditBooking;