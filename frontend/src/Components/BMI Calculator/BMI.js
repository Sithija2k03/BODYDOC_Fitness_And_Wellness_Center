import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Login/Header';

const BMI = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCalculate = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/bmi/calculate', {
        height: parseFloat(height),
        weight: parseFloat(weight),
      });
      console.log('Backend response:', response.data);
      const bmiValue = response.data.bmi;
      if (bmiValue && !isNaN(bmiValue)) {
        setBmi(parseFloat(bmiValue).toFixed(2));
      } else {
        throw new Error('Invalid BMI value from backend');
      }
      setError('');
      setTimeout(() => setShowModal(true), 100);
    } catch (err) {
      console.error('Error calculating BMI:', err.message);
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      if (!isNaN(heightInMeters) && !isNaN(weightInKg) && heightInMeters > 0 && weightInKg > 0) {
        const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(calculatedBmi);
        setError('');
        setTimeout(() => setShowModal(true), 100);
      } else {
        setBmi(null);
        setError('Failed to calculate BMI. Please check your input.');
      }
    }
  };

  const handleNavigate = (path) => {
    setShowModal(false);
    navigate(path);
  };

  // CSS Styles
  const outerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const containerStyle = {
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    color: '#333',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '-50px', // Shift the form upward
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  };

  const inputContainerStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  };

  const inputStyle = {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e04e7e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#c93c6a',
  };

  const resultStyle = {
    marginTop: '15px',
    fontSize: '18px',
    textAlign: 'center',
    color: '#34495e',
  };

  const errorStyle = {
    marginTop: '10px',
    fontSize: '14px',
    color: '#f44336',
    textAlign: 'center',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  };

  const modalTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '15px',
  };

  const modalButtonContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  };

  const modalButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  };

  const modalButtonHoverStyle = {
    backgroundColor: '#1976D2',
  };

  const modalCancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  };

  const modalCancelButtonHoverStyle = {
    backgroundColor: '#d32f2f',
  };

  return (
    <div>
      <Header />
      <div style={outerContainerStyle}>
        <div style={containerStyle}>
          <h2 style={titleStyle}>BMI Calculator</h2>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Height (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={inputStyle}
              placeholder="Enter height in cm"
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Weight (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={inputStyle}
              placeholder="Enter weight in kg"
            />
          </div>
          <button
            onClick={handleCalculate}
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Calculate BMI
          </button>
          {bmi && (
            <p style={resultStyle}>
              Your BMI is <strong>{bmi}</strong>
            </p>
          )}
          {error && (
            <p style={errorStyle}>{error}</p>
          )}
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p style={modalTitleStyle}>
              Your BMI is <strong>{bmi}</strong>
            </p>
            <h3 style={{ fontSize: '18px', color: '#34495e', marginBottom: '15px' }}>
              Would you like to generate a nutrition or workout plan?
            </h3>
            <div style={modalButtonContainerStyle}>
              <button
                onClick={() => handleNavigate('/nutrition-plan')}
                style={modalButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = modalButtonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = modalButtonStyle.backgroundColor)}
              >
                Nutrition Plan
              </button>
              <button
                onClick={() => handleNavigate('/workout-plan')}
                style={modalButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = modalButtonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = modalButtonStyle.backgroundColor)}
              >
                Workout Plan
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={modalCancelButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = modalCancelButtonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = modalCancelButtonStyle.backgroundColor)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMI;