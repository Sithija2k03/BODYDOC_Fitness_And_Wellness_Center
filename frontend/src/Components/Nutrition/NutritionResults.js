import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Login/Header'; 

function NutritionResults() {
  const location = useLocation();
  const nutritionPlan = location.state?.result || null;

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '100vh',
  };

  const titleStyle = {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const thStyle = {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
  };

  const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
  };

  if (!nutritionPlan) {
    return (
      <div style={containerStyle}>
        <Header />
        <h2 style={titleStyle}>Nutrition Plan</h2>
        <p style={errorStyle}>No nutrition plan available. Please generate a plan first.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Header />
      <h2 style={titleStyle}>Your Personalized Nutrition Plan</h2>

      {/* Daily Calorie Goal Table */}
      <h3>Daily Calorie Goal</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Total Calories</td>
            <td style={tdStyle}>{nutritionPlan.calories || 'N/A'} kcal</td>
          </tr>
        </tbody>
      </table>

      {/* Macronutrient Breakdown Table */}
      <h3>Macronutrient Breakdown</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Macronutrient</th>
            <th style={thStyle}>Amount (g)</th>
          </tr>
        </thead>
        <tbody>
          {nutritionPlan.macros ? (
            <>
              <tr>
                <td style={tdStyle}>Protein</td>
                <td style={tdStyle}>{nutritionPlan.macros.protein || 0}g</td>
              </tr>
              <tr>
                <td style={tdStyle}>Carbohydrates</td>
                <td style={tdStyle}>{nutritionPlan.macros.carbs || 0}g</td>
              </tr>
              <tr>
                <td style={tdStyle}>Fats</td>
                <td style={tdStyle}>{nutritionPlan.macros.fat || 0}g</td>
              </tr>
            </>
          ) : (
            <tr>
              <td style={tdStyle} colSpan="2">No macronutrient data available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Meal Plan Table */}
      <h3>Meal Plan</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Meal</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Calories (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {nutritionPlan.dailyMeals && nutritionPlan.dailyMeals.length > 0 ? (
            nutritionPlan.dailyMeals.map((meal, index) => (
              <tr key={index}>
                <td style={tdStyle}>{meal.title || `Meal ${index + 1}`}</td>
                <td style={tdStyle}>{meal.details || 'N/A'}</td>
                <td style={tdStyle}>{meal.calories || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan="3">No meal plan available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Recommendations Table */}
      <h3>Additional Recommendations</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {nutritionPlan.tips && nutritionPlan.tips.length > 0 ? (
            nutritionPlan.tips.map((rec, index) => (
              <tr key={index}>
                <td style={tdStyle}>{rec}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle}>No additional recommendations provided.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NutritionResults;