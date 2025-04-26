import React from "react";
import styled from "styled-components";

const BookingItem = ({ booking, onStatusChange }) => {
    const { _id, Name, email, facility_type, date, time_slot, status } = booking;

    const handleAction = (action) => {
        onStatusChange(_id, action);
    };

    // Format the date for better readability
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return (
        <BookingItemStyled>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Facility</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Name}</td>
                            <td>{facility_type}</td>
                            <td>{formattedDate}</td>
                            <td>{time_slot}</td>
                            <td>{email}</td>
                            <td>
                                <span className={`status ${status.toLowerCase()}`}>{status}</span>
                            </td>
                            <td>
                                {status.toLowerCase() === "pending" && (
                                    <div className="actions">
                                        <button className="approve" onClick={() => handleAction("Approved")}>
                                            Approve
                                        </button>
                                        <button className="decline" onClick={() => handleAction("Declined")}>
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </BookingItemStyled>
    );
};

const BookingItemStyled = styled.div`
    overflow-x: auto;
    margin-bottom: 1.5rem; /* Add spacing between table rows */

    .table-container {
        max-width: 1200px; /* Slightly wider for better spacing */
        margin: 0 auto;
    }

    table {
        border-collapse: collapse;
        background: #ffffff; /* White background for a cleaner look */
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Stronger shadow for depth */
        border-radius: 12px; /* Rounded corners */
        width: 100%;
        border: 1px solid #e0e0e0; /* Subtle border around table */
    }

    th, td {
        padding: 12px 16px; /* Increased padding for better spacing */
        text-align: left;
        border-bottom: 1px solid #e0e0e0; /* Lighter border */
        font-size: 0.9rem; /* Slightly larger font for readability */
        color: #333; /* Darker text for contrast */
    }

    th {
        background: #e0e0e0; /* Darker header background for contrast */
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        color: #555;
        letter-spacing: 0.5px;
    }

    /* Specific column widths for better alignment */
    th:nth-child(1), td:nth-child(1) { /* Name */
        width: 15%;
    }
    th:nth-child(2), td:nth-child(2) { /* Facility */
        width: 15%;
    }
    th:nth-child(3), td:nth-child(3) { /* Date */
        width: 12%;
    }
    th:nth-child(4), td:nth-child(4) { /* Time */
        width: 10%;
    }
    th:nth-child(5), td:nth-child(5) { /* Email */
        width: 25%;
        min-width: 200px; /* Ensure email doesn't wrap */
    }
    th:nth-child(6), td:nth-child(6) { /* Status */
        width: 10%;
    }
    th:nth-child(7), td:nth-child(7) { /* Actions */
        width: 13%;
    }

    /* Hover effect on rows */
    tbody tr:hover {
        background: #f9f9f9;
        transition: background 0.2s ease;
    }

    /* Alternating row colors */
    tbody tr:nth-child(even) {
        background: #f5f5f5;
    }

    .status {
        font-weight: 600;
        text-transform: capitalize;
        padding: 4px 8px;
        border-radius: 12px;
        display: inline-block;
    }

    .status.approved {
        color: #28a745;
        background: #e6f4ea; /* Light green background */
    }

    .status.declined {
        color: #dc3545;
        background: #f8d7da; /* Light red background */
    }

    .status.pending {
        color: #f39c12;
        background: #fff3cd; /* Light orange background */
    }

    .actions {
        display: flex;
        gap: 10px; /* Increased gap for better spacing */
        justify-content: flex-start;
    }

    .approve, .decline {
        border: none;
        border-radius: 6px;
        padding: 6px 12px; /* Slightly larger buttons */
        color: white;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: background 0.2s ease;
    }

    .approve {
        background: #28a745; /* Green */
    }

    .approve:hover {
        background: #218838; /* Darker green on hover */
    }

    .decline {
        background: #dc3545; /* Red */
    }

    .decline:hover {
        background: #c82333; /* Darker red on hover */
    }
`;

export default BookingItem;