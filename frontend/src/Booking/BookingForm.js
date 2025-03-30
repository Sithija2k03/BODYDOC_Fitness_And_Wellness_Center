import React, { useState } from "react";
import axios from "axios";  // Import Axios to send requests to the backend
import { useNavigate } from "react-router-dom";  // To navigate after form submission

const BookingForm = () => {
    const [formData, setFormData] = useState({
        Name: "",
        facility_type: "",
        date: "",
        time_slot: "",
        status: "Pending",
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
            const response = await axios.post("http://localhost:8070/bookings/add", formData);

            // On success, redirect to the bookings page (or show a success message)
            if (response.status === 201) {
                alert("Booking Successful!");
                navigate("/bookings");  // You can change this URL as needed
            }
        } catch (err) {
            console.error("Error while adding booking", err);
            setError("There was an issue with your booking. Please try again.");
        }
    };

    return (
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
                        <option value="Badminton">Badminton</option>
                        <option value="Pool Lounge">Pool Lounge</option>
                        {/* Add more facilities as per your requirement */}
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
                        readOnly
                    />
                </div>

                <button type="submit" className="submit-button">Book Now</button>
            </form>
        </div>
    );
};

export default BookingForm;
