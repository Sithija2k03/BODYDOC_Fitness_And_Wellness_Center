import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8070'; // Base URL for the API

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add a new appointment
  const addAppointment = async (newAppointment) => {
    try {
      const response = await axios.post(`${API_URL}/appoinments/add`, newAppointment);
      setAppointments([...appointments, response.data]); // Append new appointment
    } catch (err) {
      console.error("Error adding appointment:", err);
      setError("Failed to add appointment.");
    }
  };

  // Delete an appointment
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}`);
      setAppointments(appointments.filter(appointment => appointment._id !== id)); // Use _id for MongoDB
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment.");
    }
  };

  return (
    <GlobalContext.Provider value={{ appointments, loading, error, addAppointment, deleteAppointment }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for consuming context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
