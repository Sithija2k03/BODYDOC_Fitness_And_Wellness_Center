import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function AppointmentItem({ id, appointmentId, userName, doctorName, timeSlot, date, onDelete }) {
  const navigate = useNavigate();

  // Debug log to check props
  console.log("AppointmentItem props:", { id,appointmentId, userName, doctorName, timeSlot, date });

  const handleDelete = () => {
    if (!id) {
      alert("Cannot delete appointment: Missing ID.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      if (typeof onDelete === 'function') {
        onDelete(id);
      } else {
        console.error('onDelete is not a function');
      }
    }
  };

  const handleEdit = () => {
    console.log("Navigating to edit with id:", id);
    if (!id) {
      console.error("No ID provided for edit navigation");
      alert("Cannot edit appointment: Missing ID. Please ensure the appointment has a valid ID.");
      return;
    }
    navigate(`/appointment-edit/${id}`, {
      state: { id, userName, doctorName, timeSlot, date },
    });
  };

  return (
    <AppointmentCard>
      <div className="header">
        <h3>Appointment #{id || 'N/A'}</h3>
      </div>
      <div className="info">
        <div><strong>User:</strong> {userName || 'N/A'}</div>
        <div><strong>Doctor:</strong> {doctorName || 'N/A'}</div>
        <div><strong>Date:</strong> {date ? new Date(date).toLocaleDateString() : 'N/A'}</div>
        <div><strong>Time Slot:</strong> {timeSlot || 'N/A'}</div>
      </div>

      <div className="actions">
        <button className="edit-btn" onClick={handleEdit} >
          Edit
        </button>
        <button className="delete-btn" onClick={handleDelete} >
          Delete
        </button>
      </div>
    </AppointmentCard>
  );
}

const AppointmentCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
  border-left: 6px solid #4a90e2;

  &:hover {
    transform: translateY(-3px);
  }

  .header {
    margin-bottom: 1rem;
    h3 {
      margin: 0;
      color: #4a4a4a;
      font-size: 1.2rem;
    }
  }

  .info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.7rem;

    div {
      font-size: 0.95rem;
      color: #333;
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .edit-btn {
      background-color: #4a90e2;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #357abd;
      }
    }

    .delete-btn {
      background-color: #e74c3c;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #c0392b;
      }
    }
  }
`;

export default AppointmentItem;