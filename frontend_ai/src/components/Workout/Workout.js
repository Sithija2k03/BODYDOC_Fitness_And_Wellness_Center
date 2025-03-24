// src/components/Workout/Workout.js
import React, { useState } from 'react';
import axios from 'axios';

function Workout({ setResult }) {
  const [formData, setFormData] = useState({
    fitnessGoal: '',
    age: '',
    weight: '',
    height: '',
    userId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// src/components/Workout/Workout.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/ai/workout', formData);
    setResult(response.data);
  } catch (error) {
    console.error('Error submitting workout form:', error.response ? error.response.data : error.message);
    setResult({ message: 'Error generating workout plan', error: error.message });
  }
};

  return (
    <div className="form-container">
      <h2>Workout Plan Generator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fitnessGoal"
          placeholder="Fitness Goal (e.g., Muscle Gain)"
          value={formData.fitnessGoal}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          required
        />
        <button type="submit">Generate Workout Plan</button>
      </form>
    </div>
  );
}

export default Workout;