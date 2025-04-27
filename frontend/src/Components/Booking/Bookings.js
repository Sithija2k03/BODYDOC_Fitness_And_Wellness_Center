import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import BookingItem from "./BookingItem";
import axios from "axios";
import { search } from "../../utils/icons";

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:4000/booking/");
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching bookings:", err.response || err.message);
            setLoading(false);
            alert("Failed to load bookings. Please try again.");
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            console.log(`Updating status for booking ${id} to ${newStatus}`);
            const response = await axios.put(`http://localhost:4000/booking/status/${id}`, {
                status: newStatus,
            });

            // Update UI
            setBookings(bookings.map(b =>
                b._id === id ? { ...b, status: newStatus } : b
            ));

            alert(`Booking ${newStatus} successfully! Email notification sent.`);
        } catch (err) {
            console.error("Error updating status:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            let errorMessage = "Failed to update status.";
            if (err.response?.status === 404) {
                errorMessage = "Booking not found.";
            } else if (err.response?.status === 400) {
                errorMessage = `Invalid status: ${err.response.data.message}`;
            } else if (err.response?.status === 500) {
                errorMessage = `Server error: ${err.response.data.message || err.message}`;
            }
            alert(errorMessage);
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <BookingStyled>
            <InnerLayout>
                <h1>Bookings</h1>
                <SearchBar>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="search-icon">{search}</div>
                </SearchBar>

                <div className="bookings">
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map(b => (
                            <BookingItem
                                key={b._id}
                                booking={b}
                                onStatusChange={updateStatus}
                            />
                        ))
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
            </InnerLayout>
        </BookingStyled>
    );
};

const BookingStyled = styled.div`
  .bookings {
    margin-top: 1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;

  input {
    padding: 10px 40px 10px 10px;
    border-radius: 20px;
    border: 2px solid #228B22;
    width: 100%;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    right: 820px;
    color: #228B22;
  }
`;

export default BookingList;