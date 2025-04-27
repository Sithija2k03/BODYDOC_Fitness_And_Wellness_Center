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
        tips: response.data.tips || [],
      };

      if (!Array.isArray(transformedData.nutritionPlan) || transformedData.nutritionPlan.length === 0) {
        console.error('Nutrition plan is empty or not an array:', transformedData.nutritionPlan);
        setError('No nutrition plan data received from the server.');
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
    console.log('nutritionResult updated:', JSON.stringify(nutritionResult, null, 2));
  }, [nutritionResult]);

  // Styles
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  };

  const formContainerStyle = {
    flex: '0 0 400px',
    minWidth: '350px',
    maxWidth: '400px',
    minHeight: '500px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start',
    '@media (max-width: 768px)': {
      flex: '0 0 100%',
      minWidth: '100%',
      maxWidth: '100%',
      position: 'static',
    },
  };

  const resultsContainerStyle = {
    flex: '1',
    minWidth: '300px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
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
    gap: '12px',
    position: 'relative',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  const inputErrorStyle = {
    borderColor: '#F56692',
  };

  const buttonStyle = {
    padding: '12px',
    backgroundColor: isSubmitting || Object.keys(errors).length > 0 ? '#cccccc' : '#e04e7e',
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
    color: '#F56692',
    fontSize: '12px',
    marginTop: '5px',
  };

  const formErrorStyle = {
    color: '#F56692',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  };

  const loadingOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  };

  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #F56692',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: '500',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div>
      <Header />
      <style>{keyframes}</style>
      <div style={mainContainerStyle}>
        <div style={formContainerStyle}>
          <h2 style={headingStyle}>Nutrition Plan Generator</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            {isSubmitting && (
              <div style={loadingOverlayStyle}>
                <div style={spinnerStyle}></div>
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
                  Generating Nutrition Plan...
                </p>
              </div>
            )}
            <div>
              <label style={labelStyle} htmlFor="fitnessGoal">Fitness Goal (e.g., Weight Loss)</label>
              <input
                type="text"
                id="fitnessGoal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                required
                style={{ ...inputStyle, ...(errors.fitnessGoal ? inputErrorStyle : {}) }}
                disabled={isSubmitting}
              />
              {errors.fitnessGoal && <p style={errorStyle}>{errors.fitnessGoal}</p>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                step="1"
                style={{ ...inputStyle, ...(errors.age ? inputErrorStyle : {}) }}
                disabled={isSubmitting}
              />
              {errors.age && <p style={errorStyle}>{errors.age}</p>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="0.1"
                max="500"
                step="0.1"
                style={{ ...inputStyle, ...(errors.weight ? inputErrorStyle : {}) }}
                disabled={isSubmitting}
              />
              {errors.weight && <p style={errorStyle}>{errors.weight}</p>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min="0.1"
                max="300"
                step="0.1"
                style={{ ...inputStyle, ...(errors.height ? inputErrorStyle : {}) }}
                disabled={isSubmitting}
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
        </div>
        <div style={resultsContainerStyle}>
          {nutritionResult ? (
            <NutritionResults title="Nutrition Plan" data={nutritionResult} />
          ) : (
            <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '16px' }}>
              No results yet. Submit the form to generate a nutrition plan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nutrition;