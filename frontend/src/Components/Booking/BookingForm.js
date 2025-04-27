import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../Login/Header";

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const facilityType = location.state?.facilityType || "";

    const [formData, setFormData] = useState({
        Name: "",
        email: "",
        facility_type: facilityType,
        date: "",
        time_slot: "",
    });

    const [error, setError] = useState(null);
    const [dateError, setDateError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "date") {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (selectedDate < currentDate) {
                setDateError("Please select a future date");
            } else {
                setDateError(null);
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDate = new Date(formData.date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            setDateError("Please select a future date");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/booking/add-book", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 201) {
                alert("Booking Successful!");
                navigate("/");
            }
        } catch (err) {
            console.error("Error while adding booking", err);
            setError("There was an issue with your booking. Please try again.");
        }
    };

    const containerStyle = {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        background: "#f4f4f4",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    };

    const headingStyle = {
        textAlign: "center",
        color: "#333",
        marginBottom: "20px",
    };

    const formGroupStyle = {
        marginBottom: "15px",
    };

    const labelStyle = {
        display: "block",
        fontWeight: "bold",
        marginBottom: "5px",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
        boxSizing: "border-box",
    };

    const inputFocusStyle = {
        borderColor: "#007bff",
        outline: "none",
    };

    const errorMessageStyle = {
        color: "red",
        textAlign: "center",
        marginBottom: "10px",
        fontWeight: "bold",
    };

    const fieldErrorStyle = {
        color: "red",
        fontSize: "14px",
        marginTop: "5px",
    };

    const submitButtonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background 0.3s",
    };

    const submitButtonHoverStyle = {
        backgroundColor: "#218838",
    };

    const invalidInputStyle = {
        ...inputStyle,
        border: "1px solid red",
    };

    return (
        <div>
            <Header />

            <div style={containerStyle}>
                <h2 style={headingStyle}>Online Booking Form</h2>

                {error && <div style={errorMessageStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label htmlFor="name" style={labelStyle}>Name</label>
                        <input
                            type="text"
                            id="name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="facility_type" style={labelStyle}>Facility Type</label>
                        <select
                            id="facility_type"
                            name="facility_type"
                            value={formData.facility_type}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Facility</option>
                            <option value="Gym">Gym</option>
                            <option value="Swimming Pool">Swimming Pool</option>
                            <option value="Badminton Court">Badminton Court</option>
                            <option value="Pool Lounge">Pool Lounge</option>
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="date" style={labelStyle}>Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            style={dateError ? invalidInputStyle : inputStyle}
                            required
                        />
                        {dateError && <div style={fieldErrorStyle}>{dateError}</div>}
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="time_slot" style={labelStyle}>Time Slot</label>
                        <input
                            type="time"
                            id="time_slot"
                            name="time_slot"
                            value={formData.time_slot}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={submitButtonStyle}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                        disabled={dateError}
                    >
                        Book Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
