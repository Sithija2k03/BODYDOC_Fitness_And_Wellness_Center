import React, { useEffect, useState } from 'react';
import AdminAppointment from './AdminAppointmentItem';
import { useGlobalContext } from '../../context/globalContext';
import styled from 'styled-components';
import { search } from "../../utils/icons";

function AppointmentsList() {
  const { appointments, getAppointments, loading, error } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    getAppointments();
  }, []);

  // Filter appointments based on userName
  const filteredAppointments = appointments.filter(appointment =>
    appointment.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AppointmentsListStyled>
        <h2>Appointments List</h2>
        <SearchBar>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon">{search}</div>
        </SearchBar>
        <div className="appointments">
          {loading ? (
            <p className="status">Loading appointments...</p>
          ) : error ? (
            <p className="status error">{error}</p>
          ) : filteredAppointments && filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <AdminAppointment
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
    right: 760px;
    color: #228B22;
  }
`;

export default AppointmentsList;