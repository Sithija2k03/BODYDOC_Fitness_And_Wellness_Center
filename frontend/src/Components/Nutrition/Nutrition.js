import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Login/Header';
import NutritionResults from './NutritionResults';

function Nutrition() {
  const [formData, setFormData] = useState({
    fitnessGoal: '',
    age: '',
    weight: '',
    height: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [nutritionResult, setNutritionResult] = useState(null);

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fitnessGoal.trim()) {
      newErrors.fitnessGoal = 'Fitness goal is required';
    } else if (!/^[a-zA-Z\s,.-]{2,50}$/.test(data.fitnessGoal.trim())) {
      newErrors.fitnessGoal = 'Fitness goal must be 2-50 characters (letters, spaces, commas, periods, or hyphens)';
    }

    if (!data.age) {
      newErrors.age = 'Age is required';
    } else if (!/^\d+$/.test(data.age) || parseInt(data.age) <= 0 || parseInt(data.age) > 120) {
      newErrors.age = 'Age must be a positive integer between 1 and 120';
    }

    if (!data.weight) {
      newErrors.weight = 'Weight is required';
    } else if (!/^\d*\.?\d*$/.test(data.weight) || parseFloat(data.weight) <= 0 || parseFloat(data.weight) > 500) {
      newErrors.weight = 'Weight must be a positive number between 0.1 and 500 kg';
    }

    if (data.height && (!/^\d*\.?\d*$/.test(data.height) || parseFloat(data.height) <= 0 || parseFloat(data.height) > 300)) {
      newErrors.height = 'Height must be a positive number between 0.1 and 300 cm';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['age', 'weight', 'height'].includes(name)) {
      if (name !== 'age' && /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else if (name === 'age' && /^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    const newErrors = validateForm({ ...formData, [name]: value });
    setErrors(newErrors);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:4000/api/ai/nutrition', formData);
      if (!response.data) {
        throw new Error('Invalid response from server: No data');
      }
      console.log('Raw Backend Response:', response.data);

      const transformedData = {
        message: response.data.message || '✅ Nutrition Plan Generated Successfully!',
        nutritionPlan: response.data.nutritionPlan || [],
        tips: response.data.tips || [], // Added tips field
      };

      // Validate nutritionPlan
      if (!Array.isArray(transformedData.nutritionPlan) || transformedData.nutritionPlan.length === 0) {
        console.error('Nutrition plan is empty or not an array:', transformedData.nutritionPlan);
        setError('No nutrition plan data received from the server.');
        setIsSubmitting(false);
        return;
      }

      // Validate tips
      if (!Array.isArray(transformedData.tips) || transformedData.tips.length === 0) {
        console.error('Tips are empty or not an array:', transformedData.tips);
        setError('No additional recommendations received from the server.');
        setIsSubmitting(false);
        return;
      }

      setNutritionResult(transformedData);
      console.log('Transformed Nutrition Plan:', transformedData);
    } catch (error) {
      console.error('Error submitting nutrition form:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || error.message || 'Failed to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log('nutritionResult updated:', nutritionResult);
  }, [nutritionResult]);

  // Styles (unchanged)
  const containerStyle = {
    flex: 1,
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
    fontSize: '24px',
  };
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };
  const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };
  const inputErrorStyle = {
    borderColor: 'red',
  };
  const buttonStyle = {
    padding: '12px',
    backgroundColor: isSubmitting || Object.keys(errors).length > 0 ? '#cccccc' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: isSubmitting || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  };
  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  };
  const formErrorStyle = {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <Header />
      <h2 style={headingStyle}>Nutrition Plan Generator</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <input
            type="text"
            name="fitnessGoal"
            placeholder="Fitness Goal (e.g., Weight Loss)"
            value={formData.fitnessGoal}
            onChange={handleChange}
            required
            style={{ ...inputStyle, ...(errors.fitnessGoal ? inputErrorStyle : {}) }}
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
            required
            min="1"
            max="120"
            step="1"
            style={{ ...inputStyle, ...(errors.age ? inputErrorStyle : {}) }}
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
            required
            min="0.1"
            max="500"
            step="0.1"
            style={{ ...inputStyle, ...(errors.weight ? inputErrorStyle : {}) }}
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
            min="0.1"
            max="300"
            step="0.1"
            style={{ ...inputStyle, ...(errors.height ? inputErrorStyle : {}) }}
          />
          {errors.height && <p style={errorStyle}>{errors.height}</p>}
        </div>
        <button
          type="submit"
          style={buttonStyle}
          disabled={isSubmitting || Object.keys(errors).length > 0}
        >
          {isSubmitting ? 'Generating...' : 'Generate Nutrition Plan'}
        </button>
      </form>
      {error && <p style={formErrorStyle}>{error}</p>}
      {nutritionResult && (
        <NutritionResults title="Nutrition Plan" data={nutritionResult} />
      )}
    </div>
  );
}

export default Nutrition;