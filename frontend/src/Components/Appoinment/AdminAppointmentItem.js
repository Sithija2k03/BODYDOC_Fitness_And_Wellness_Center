import React from 'react';
import styled from 'styled-components';

function AdminAppointment({ id, userName, doctorName, timeSlot, date }) {
  // Format the date for better readability
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return (
    <AppointmentCard>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time Slot</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#{id}</td>
              <td>{userName}</td>
              <td>{doctorName}</td>
              <td>{formattedDate}</td>
              <td>{timeSlot}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppointmentCard>
  );
}

const AppointmentCard = styled.div`
  overflow-x: auto;
  margin-bottom: 1.5rem; /* Add spacing between table rows */

  .table-container {
    max-width: 1200px; /* Match BookingItem max-width */
    margin: 0 auto;
  }

  table {
    border-collapse: collapse;
    background: #ffffff; /* White background to match BookingItem */
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Match BookingItem shadow */
    border-radius: 12px; /* Match BookingItem border-radius */
    width: 100%;
    border: 1px solid #e0e0e0; /* Subtle border to match BookingItem */
  }

  th, td {
    padding: 12px 16px; /* Match BookingItem padding */
    text-align: left;
    border-bottom: 1px solid #e0e0e0; /* Match BookingItem border */
    font-size: 0.9rem; /* Match BookingItem font size */
    color: #333; /* Match BookingItem text color */
  }

  th {
    background: #e0e0e0; /* Match BookingItem header background */
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #555;
    letter-spacing: 0.5px;
  }

  /* Specific column widths for better alignment */
  th:nth-child(1), td:nth-child(1) { /* Appointment ID */
    width: 15%;
  }
  th:nth-child(2), td:nth-child(2) { /* User */
    width: 20%;
  }
  th:nth-child(3), td:nth-child(3) { /* Doctor */
    width: 20%;
  }
  th:nth-child(4), td:nth-child(4) { /* Date */
    width: 15%;
  }
  th:nth-child(5), td:nth-child(5) { /* Time Slot */
    width: 15%;
  }

  /* Hover effect on rows */
  tbody tr:hover {
    background: #f9f9f9; /* Match BookingItem hover effect */
    transition: background 0.2s ease;
  }

  /* Alternating row colors */
  tbody tr:nth-child(even) {
    background: #f5f5f5; /* Match BookingItem alternating row color */
  }
`;

export default AdminAppointment;