import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8070'; // Base URL for the API

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAppointments = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
  
    try {
      // Corrected the API URL and the route for fetching appointments
      const response = await axios.get(`${API_URL}/appointments/`);  // Ensure '/appointments/' is correct
  
      console.log("API Response:", response.data); // Debugging log
  
      if (Array.isArray(response.data)) {
        setAppointments(response.data);  // Expected response format: an array of appointments
      } else if (response.data && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);  // Adjust if response structure is different
      } else {
        console.error("Unexpected API response:", response.data);
        setError("Invalid data format received from server.");
        setAppointments([]); // Ensure state is updated even if data is invalid
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments. Please try again later.");
      setAppointments([]); // Reset appointments in case of error
    } finally {
      setLoading(false);
    }
  };
  


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
    <GlobalContext.Provider value={{ appointments, loading, error, addAppointment, deleteAppointment, getAppointments }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for consuming context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
