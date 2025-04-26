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
      console.log('Backend response:', response.data); // Log response to debug
      const bmiValue = response.data.bmi;
      if (bmiValue && !isNaN(bmiValue)) {
        setBmi(parseFloat(bmiValue).toFixed(2)); // Ensure valid number
      } else {
        throw new Error('Invalid BMI value from backend');
      }
      setError('');
      // Delay modal to ensure BMI renders
      setTimeout(() => setShowModal(true), 100);
    } catch (err) {
      console.error('Error calculating BMI:', err.message); // Log error
      // Fallback local calculation
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

  return (
    <div>
      <Header />
      <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>BMI Calculator</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          onClick={handleCalculate}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Calculate BMI
        </button>
        {bmi && (
          <p style={{ marginTop: '15px', fontSize: '18px', textAlign: 'center' }}>
            Your BMI is <strong>{bmi}</strong>
          </p>
        )}
        {error && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>
        )}
      </div>

      {showModal && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >

            <p style={{ marginTop: '10px', fontSize: '24px' }}>
                Your BMI is <strong>{bmi}</strong>
              </p>
            <h3>Would you like to generate a nutrition or workout plan?</h3>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => handleNavigate('/nutrition-plan')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Nutrition Plan
              </button>
              <button
                onClick={() => handleNavigate('/workout-plan')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Workout Plan
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
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