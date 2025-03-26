import React, { useEffect } from 'react';
import AppointmentItem from '../AppointmentItem/AppointmentItem';
import { useGlobalContext } from '../../context/globalContext';
import styled from 'styled-components';
import AppointmentForm from './AppoinmentForm';

function AppointmentsList() {
  const { appointments, getAppointments, loading, error } = useGlobalContext(); 

  useEffect(() => {
    getAppointments();
  }, []);
  

  return (
    <AppointmentsListStyled>
      <h2>Appointments List</h2>
      <AppointmentForm />
      <div className="appointments">
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p>{error}</p>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              id={appointment.id}
              userName={appointment.user_name}
              doctorName={appointment.doctor_name}
              timeSlot={appointment.time_slot}
              date={appointment.date}
            />
          ))
        ) : (
          <p>No appointments found</p>
        )}
      </div>
    </AppointmentsListStyled>
  );
}

const AppointmentsListStyled = styled.div`
  padding: 1rem;
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .appointments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export default AppointmentsList;
