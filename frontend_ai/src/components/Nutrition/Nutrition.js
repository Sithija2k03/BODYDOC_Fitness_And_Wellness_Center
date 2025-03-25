// src/components/Nutrition/Nutrition.js
import React, { useState } from 'react';
import axios from 'axios';

function Nutrition({ setResult }) {
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

// src/components/Nutrition/Nutrition.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/ai/nutrition', formData);
    setResult(response.data);
  } catch (error) {
    console.error('Error submitting nutrition form:', error.response ? error.response.data : error.message);
    setResult({ message: 'Error generating nutrition plan', error: error.message });
  }
};

 // ... rest of your JSX with styles ...
 return (
  <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
    <h2 style={{ marginBottom: '20px' }}>Nutrition Plan Generator</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input type="text" name="fitnessGoal" placeholder="Fitness Goal (e.g., Weight Loss)" value={formData.fitnessGoal} onChange={handleChange} required style={{ padding: '8px', fontSize: '16px' }} />
      <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={{ padding: '8px', fontSize: '16px' }} />
      <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required style={{ padding: '8px', fontSize: '16px' }} />
      <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} required style={{ padding: '8px', fontSize: '16px' }} />
      <input type="text" name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} required style={{ padding: '8px', fontSize: '16px' }} />
      <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Generate Nutrition Plan</button>
    </form>
  </div>
);
}

export default Nutrition;