import React from 'react';
import styled from 'styled-components';

function AppointmentItem({ id, userName, doctorName, timeSlot, date }) {
  return (
    <AppointmentCard>
      <div className="header">
        <h3>Appointment #{id}</h3>
      </div>
      <div className="info">
        <div><strong>User:</strong> {userName}</div>
        <div><strong>Doctor:</strong> {doctorName}</div>
        <div><strong>Date:</strong> {date}</div>
        <div><strong>Time Slot:</strong> {timeSlot}</div>
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
`;

export default AppointmentItem;
