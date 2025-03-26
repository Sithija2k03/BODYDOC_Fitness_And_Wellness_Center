import React, { useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext'; // Update the path to import from context
import AppointmentItem from './AppointmentItem'; // Import the AppointmentItem
import styled from 'styled-components';

function AppointmentsList() {
    const { appointments, getAppointments } = useGlobalContext(); // Get appointments from context

    // Fetch appointments when the component is mounted
    useEffect(() => {
        getAppointments(); // Call to fetch the appointments when the component mounts
    }, [getAppointments]);

    return (
        <AppointmentsListStyled>
            <h2>Appointments List</h2>
            <div className="appointments">
                {appointments && appointments.length > 0 ? (
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
                    <p>No appointments available</p>
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
