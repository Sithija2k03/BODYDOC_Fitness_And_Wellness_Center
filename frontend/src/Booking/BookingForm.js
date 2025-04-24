import React, { useState } from "react";
import axios from "axios";  // Import Axios to send requests to the backend
import { useNavigate } from "react-router-dom";  // To navigate after form submission

const BookingForm = () => {
    const [formData, setFormData] = useState({
        Name: "",
        facility_type: "",
        date: "",
        time_slot: "",
        status: "",
    });

    const [error, setError] = useState(null);  // To handle error states
    const navigate = useNavigate();  // To navigate to another page

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the booking data to the backend API (Replace the URL with your backend URL)
            const response = await axios.post("http://localhost:4000/booking/add", formData);

            // On success, redirect to the bookings page (or show a success message)
            if (response.status === 201) {
                alert("Booking Successful!");
                navigate("/booking-list");  // Redirect to the booking list page
            }
        } catch (err) {
            console.error("Error while adding booking", err);
            setError("There was an issue with your booking. Please try again.");
        }
    };

    return (
        <div>
            <style>
                {`
                .booking-form-container {
                    max-width: 400px;
                    margin: 50px auto;
                    padding: 20px;
                    background: #f4f4f4;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    text-align: center;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                input, select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }

                input:focus, select:focus {
                    border-color: #007bff;
                    outline: none;
                }

                .submit-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .submit-button:hover {
                    background-color: #218838;
                }

                .error-message {
                    color: red;
                    text-align: center;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                `}
            </style>
            <div className="booking-form-container">
                <h2>Online Booking Form</h2>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="facility_type">Facility Type</label>
                        <select
                            id="facility_type"
                            name="facility_type"
                            value={formData.facility_type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Facility</option>
                            <option value="Gym">Gym</option>
                            <option value="Swimming Pool">Swimming Pool</option>
                            <option value="Badminton Court">Badminton Court</option>
                            <option value="Pool Lounge">Pool Lounge</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time_slot">Time Slot</label>
                        <input
                            type="time"
                            id="time_slot"
                            name="time_slot"
                            value={formData.time_slot}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required

                           
                        />
                    </div>

                    <button type="submit" className="submit-button">Book Now</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
