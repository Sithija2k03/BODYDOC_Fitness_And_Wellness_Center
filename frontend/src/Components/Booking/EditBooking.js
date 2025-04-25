import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    email: "", // Added email field
    facility_type: "",
    date: "",
    time_slot: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/booking/${id}`);
        const booking = res.data;

        setFormData({
          Name: booking.Name || "",
          email: booking.email || "", // Added email field
          facility_type: booking.facility_type || "",
          date: booking.date?.slice(0, 10) || "",
          time_slot: booking.time_slot || "",
          status: booking.status || "",
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

    try {
      await axios.put(`http://localhost:4000/booking/update/${id}`, formData);
      alert("Booking updated successfully!");
      navigate("/bookings");
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking.");
    }
  };

  if (loading) return <p>Loading booking details...</p>;

  return (
    <>
      <style>{`
        .edit-booking-container {
          max-width: 500px;
          margin: 60px auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .edit-booking-container h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #2c3e50;
          font-size: 24px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #34495e;
          font-size: 15px;
        }

        input,
        select {
          width: 100%;
          height: 45px;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          color: #333;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        input:focus,
        select:focus {
          border-color: #3498db;
          outline: none;
        }

        .submit-button {
          width: 100%;
          height: 50px;
          background-color: #3498db;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #2980b9;
        }

        .error-message {
          color: #e74c3c;
          background-color: #fdecea;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>

      <div className="edit-booking-container">
        <h2>Edit Booking</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Name">Full Name</label>
            <input
              type="text"
              name="Name"
              id="Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label htmlFor="facility_type">Facility Type</label>
            <select
              name="facility_type"
              id="facility_type"
              value={formData.facility_type}
              onChange={handleChange}
              required
            >

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
            <label htmlFor="date">Booking Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time_slot">Time Slot</label>
            <input
              type="time"
              name="time_slot"
              id="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              type="text"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Update Booking
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBooking;