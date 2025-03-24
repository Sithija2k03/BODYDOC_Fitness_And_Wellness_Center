// src/components/ResultDisplay.js
import React from 'react';

function ResultDisplay({ title, data }) {
  return (
    <div className="result-container">
      <h2>{title}</h2>
      <p>{data.message}</p>
      {data.workoutPlan && <pre>{data.workoutPlan}</pre>}
      {data.nutritionPlan && <pre>{data.nutritionPlan}</pre>}
    </div>
  );
}

export default ResultDisplay;