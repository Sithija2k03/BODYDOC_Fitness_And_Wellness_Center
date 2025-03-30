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
                navigate("/booking");  // You can change this URL as needed
            }
        } catch (err) {
            console.error("Error while adding booking", err);
            setError("There was an issue with your booking. Please try again.");
        }
    };

    // Internal CSS with colorful and modern design
    const styles = {
        container: {
            maxWidth: "400px",
            margin: "auto",
            padding: "30px",
            backgroundColor: "#f0f8ff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
        },
        heading: {
            color: "#2c3e50",
            fontSize: "24px",
            marginBottom: "15px",
        },
        formGroup: {
            marginBottom: "15px",
            textAlign: "left",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#34495e",
        },
        input: {
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #bdc3c7",
            backgroundColor: "#ecf0f1",
        },
        select: {
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #bdc3c7",
            backgroundColor: "#ecf0f1",
        },
        button: {
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s ease",
        },
        buttonHover: {
            backgroundColor: "#c0392b",
        },
        errorMessage: {
            color: "red",
            textAlign: "center",
            marginBottom: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Online Booking Form</h2>
            
            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Name</label>
                    <input
                        type="text"
                        id="name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="facility_type" style={styles.label}>Facility Type</label>
                    <select
                        id="facility_type"
                        name="facility_type"
                        value={formData.facility_type}
                        onChange={handleInputChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select Facility</option>
                        <option value="Gym">Gym</option>
                        <option value="Swimming Pool">Swimming Pool</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Pool Lounge">Pool Lounge</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="date" style={styles.label}>Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="time_slot" style={styles.label}>Time Slot</label>
                    <input
                        type="time"
                        id="time_slot"
                        name="time_slot"
                        value={formData.time_slot}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="status" style={styles.label}>Status</label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        value={formData.status}
                        readOnly
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.button}>Book Now</button>
            </form>
        </div>
    );
};

export default BookingForm;