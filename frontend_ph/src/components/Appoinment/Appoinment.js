import React, { useEffect } from 'react';
import AppointmentItem from '../AppointmentItem/';
import { useGlobalContext } from '../../context/globalContext'; // Import the global context
import styled from 'styled-components';

function AppointmentsList() {
  const { appointments, getAppointments, loading, error } = useGlobalContext(); // Get loading, error and appointments from context

  useEffect(() => {
    // Call to fetch the appointments when the component mounts
    getAppointments();
  }, [getAppointments]);

  return (
    <AppointmentsListStyled>
      <h2>Appointments List</h2>
      <div className="appointments">
        {loading ? (
          <p>Loading appointments...</p> // Display a loading message or spinner
        ) : error ? (
          <p>{error}</p> // Display error message if the fetch fails
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              id={appointment.id}
              userName={appointment.user_name} // Adjusted the prop name to match the data
              doctorName={appointment.doctor_name} // Adjusted the prop name to match the data
              timeSlot={appointment.time_slot} // Adjusted the prop name to match the data
              date={appointment.date}
            />
          ))
        ) : (
          <p>No appointments found</p> // Show this message when no appointments are found
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
