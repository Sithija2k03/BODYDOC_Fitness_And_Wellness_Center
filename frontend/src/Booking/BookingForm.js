import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
    const [formData, setFormData] = useState({
        Name: "",
        facility_type: "",
        date: "",
        time_slot: "",
        status: "",
    });

    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "Name") {
            const onlyLetters = /^[A-Za-z\s]*$/;
            if (!onlyLetters.test(value)) {
                setNameError("Name can only contain letters and spaces.");
                return;
            } else {
                setNameError("");
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            setError("Please select a future date.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/booking/add", formData);
            if (response.status === 201) {
                alert("Booking Successful!");
                navigate("/booking-list");
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
                    max-width: 500px;
                    margin: 60px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                h2 {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #2c3e50;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }

                input, select {
                    width: 100%;
                    height: 45px;
                    padding: 0 12px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }

                input:focus, select:focus {
                    border-color: #3498db;
                    outline: none;
                }

                .submit-button {
                    width: 100%;
                    height: 50px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .submit-button:hover {
                    background-color: #2980b9;
                }

                .error-message {
                    color: #e74c3c;
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 15px;
                    font-weight: bold;
                }

                .field-error {
                    color: #e74c3c;
                    font-size: 14px;
                    margin-top: 5px;
                }
                `}
            </style>

            <div className="booking-form-container">
                <h2>Facility Booking</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            required
                        />
                        {nameError && <div className="field-error">{nameError}</div>}
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
                            <option value="">-- Select Facility --</option>
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

                    <button type="submit" className="submit-button">Confirm Booking</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
