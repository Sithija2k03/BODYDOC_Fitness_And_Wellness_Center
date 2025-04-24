
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../Login/Header';
import ResultDisplay from '../ResultDisplay';

function Workout({ setResult }) {
  const [formData, setFormData] = useState({
    fitnessGoal: '',
    age: '',
    weight: '',
    height: '',
    userId: ''
  });
  const [workoutResult, setWorkoutResult] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/workout', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting workout form:', error.response ? error.response.data : error.message);
      setResult({ message: 'Error generating workout plan', error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const containerStyle = {
    flex: 1,
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
    fontSize: '24px'
  };
  
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };
  
  const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease'
  };
  
  const buttonStyle = {
    padding: '12px',
    backgroundColor: isSubmitting ? '#cccccc' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '10px'
  };

  return (
    <div style={containerStyle}>
      <Header />
      <h2 style={headingStyle}>Workout Plan Generator</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="fitnessGoal"
          placeholder="Fitness Goal (e.g., Muscle Gain)"
          value={formData.fitnessGoal}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button 
          type="submit" 
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generating...' : 'Generate Workout Plan'}
        </button>
      </form>
      {/* Display results below the routed components */}
              <div className="results-container">
                {workoutResult && <ResultDisplay title="Workout Plan" data={workoutResult} />}
              </div>
    </div>
  );
}

export default Workout;
