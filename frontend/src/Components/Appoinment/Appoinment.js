import React, { useEffect } from 'react';
import AppointmentItem from './AppointmentItem';
import { useGlobalContext } from '../../context/globalContext';
import styled from 'styled-components';
import Header from '../../Login/Header';

function AppointmentsList() {
  const { appointments, getAppointments, loading, error } = useGlobalContext();

  useEffect(() => {
    getAppointments();
  },[]);

  return (
    <>
    <Header/>
    <AppointmentsListStyled>
      <h2>Appointments List</h2>
      <div className="appointments">
        {loading ? (
          <p className="status">Loading appointments...</p>
        ) : error ? (
          <p className="status error">{error}</p>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <AppointmentItem
              key={appointment.id || index} // Use index as fallback if id is missing
              id={appointment.id}
              userName={appointment.user_name}
              doctorName={appointment.doctor_name}
              timeSlot={appointment.time_slot}
              date={appointment.date}
            />
          ))
        ) : (
          <p className="status">No appointments found</p>
        )}
      </div>
    </AppointmentsListStyled>
    </>
  );
}

const AppointmentsListStyled = styled.div`
  padding: 2rem;
  background: #f9f9f9;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .appointments {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .status {
    font-size: 1rem;
    color: #555;
  }

  .status.error {
    color: #e74c3c;
  }
`;

export default AppointmentsList;
