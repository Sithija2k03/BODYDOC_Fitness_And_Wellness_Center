import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:4000/booking/");
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Error fetching bookings. Please try again later.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await axios.delete(`http://localhost:4000/booking/delete/${id}`);
                alert("Booking deleted successfully!");
                setBookings(bookings.filter((booking) => booking._id !== id));
            } catch (err) {
                console.error("Error deleting booking:", err);
                alert("Error deleting booking. Please try again.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-booking/${id}`);
    };

    return (
        <div>
            <style>
                {`
                .booking-list-container {
                    max-width: 1000px;
                    margin: 40px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                h2 {
                    text-align: center;
                    color: #222;
                    font-size: 28px;
                    margin-bottom: 20px;
                }

                .table-container {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                    font-size: 15px;
                }

                th {
                    background-color: #007bff;
                    color: white;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                tr:hover {
                    background-color: #f1f1f1;
                    transition: background-color 0.3s ease;
                }

                .edit-button,
                .delete-button {
                    padding: 6px 14px;
                    margin-right: 6px;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .edit-button {
                    background-color: #28a745;
                }

                .edit-button:hover {
                    background-color: #218838;
                    transform: scale(1.05);
                }

                .delete-button {
                    background-color: #dc3545;
                }

                .delete-button:hover {
                    background-color: #c82333;
                    transform: scale(1.05);
                }

                .no-data {
                    text-align: center;
                    font-size: 16px;
                    color: #777;
                    margin-top: 20px;
                }

                @media (max-width: 600px) {
                    th, td {
                        font-size: 13px;
                        padding: 10px;
                    }

                    .edit-button,
                    .delete-button {
                        font-size: 13px;
                        padding: 5px 10px;
                    }
                }
                `}
            </style>

            <div className="booking-list-container">
                <h2>Booking List</h2>

                {loading && <p>Loading bookings...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && bookings.length === 0 && (
                    <p className="no-data">No bookings found.</p>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Facility Type</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>{booking.Name}</td>
                                        <td>{booking.facility_type}</td>
                                        <td>{new Date(booking.date).toISOString().slice(0, 10)}</td>
                                        <td>{booking.time_slot}</td>
                                        <td>{booking.status}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(booking._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(booking._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingList;
