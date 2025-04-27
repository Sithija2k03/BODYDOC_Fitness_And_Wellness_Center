
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
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate fitnessGoal
    if (!formData.fitnessGoal.trim()) {
      newErrors.fitnessGoal = "Fitness goal is required";
    } else if (formData.fitnessGoal.length < 3) {
      newErrors.fitnessGoal = "Fitness goal should be more descriptive";
    }
    
    // Validate age
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 10 || formData.age > 100) {
      newErrors.age = "Age must be between 10 and 100";
    }
    
    // Validate weight
    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(formData.weight) || formData.weight < 20 || formData.weight > 300) {
      newErrors.weight = "Weight must be between 20 and 300 kg";
    }
    
    // Validate height
    if (!formData.height) {
      newErrors.height = "Height is required";
    } else if (isNaN(formData.height) || formData.height < 100 || formData.height > 250) {
      newErrors.height = "Height must be between 100 and 250 cm";
    }
    
    // Validate userId
    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (formData.userId.length < 5) {
      newErrors.userId = "User ID must be at least 5 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/nutrition', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting nutrition form:', error.response ? error.response.data : error.message);
      setResult({ 
        message: 'Error generating nutrition plan', 
        error: error.response?.data?.message || error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%'
  };
  
  const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginTop: '4px'
  };

  return (
    <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ marginBottom: '20px' }}>Nutrition Plan Generator</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input 
            type="text" 
            name="fitnessGoal" 
            placeholder="Fitness Goal (e.g., Weight Loss)" 
            value={formData.fitnessGoal} 
            onChange={handleChange} 
            style={{...inputStyle, borderColor: errors.fitnessGoal ? 'red' : '#ccc'}} 
          />
          {errors.fitnessGoal && <p style={errorStyle}>{errors.fitnessGoal}</p>}
        </div>
        
        <div>
          <input 
            type="number" 
            name="age" 
            placeholder="Age" 
            value={formData.age} 
            onChange={handleChange} 
            style={{...inputStyle, borderColor: errors.age ? 'red' : '#ccc'}} 
          />
          {errors.age && <p style={errorStyle}>{errors.age}</p>}
        </div>
        
        <div>
          <input 
            type="number" 
            name="weight" 
            placeholder="Weight (kg)" 
            value={formData.weight} 
            onChange={handleChange} 
            style={{...inputStyle, borderColor: errors.weight ? 'red' : '#ccc'}} 
          />
          {errors.weight && <p style={errorStyle}>{errors.weight}</p>}
        </div>
        
        <div>
          <input 
            type="number" 
            name="height" 
            placeholder="Height (cm)" 
            value={formData.height} 
            onChange={handleChange} 
            style={{...inputStyle, borderColor: errors.height ? 'red' : '#ccc'}} 
          />
          {errors.height && <p style={errorStyle}>{errors.height}</p>}
        </div>
        
        <div>
          <input 
            type="text" 
            name="userId" 
            placeholder="User ID" 
            value={formData.userId} 
            onChange={handleChange} 
            style={{...inputStyle, borderColor: errors.userId ? 'red' : '#ccc'}} 
          />
          {errors.userId && <p style={errorStyle}>{errors.userId}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#cccccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isSubmitting ? 'Generating...' : 'Generate Nutrition Plan'}
        </button>
      </form>
    </div>
  );
}

export default Nutrition;
