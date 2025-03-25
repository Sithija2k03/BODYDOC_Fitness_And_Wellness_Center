// // src/components/ResultDisplay.js
// import React from 'react';

// function ResultDisplay({ title, data }) {
//   return (
//     <div className="result-container">
//       <h2>{title}</h2>
//       <p>{data.message}</p>
//       {data.workoutPlan && <pre>{data.workoutPlan}</pre>}
//       {data.nutritionPlan && <pre>{data.nutritionPlan}</pre>}
//     </div>
//   );
// }

// export default ResultDisplay;

// src/components/ResultDisplay.js
import React from 'react';

function ResultDisplay({ title, data }) {
  const resultContainerStyles = { padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '20px' };
  const tableStyles = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
  const thStyles = { backgroundColor: '#f8f9fa', padding: '10px', border: '1px solid #ddd', textAlign: 'left' };
  const tdStyles = { padding: '10px', border: '1px solid #ddd' };
  const errorStyles = { color: 'red' };
  const preStyles = { whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' };

  const renderTable = (plan) => {
    if (!plan) {
      return <p style={errorStyles}>No plan data provided</p>;
    }

    try {
      const parsedPlan = typeof plan === 'string' ? JSON.parse(plan) : plan;
      if (!Array.isArray(parsedPlan)) {
        return <p style={errorStyles}>Invalid plan format</p>;
      }

      return parsedPlan.map((section, index) => (
        <div key={index}>
          {section.section && <h3>{section.section}</h3>}
          {section.error && <p style={errorStyles}>Error: {section.error}</p>}
          {section.rawText && <pre style={preStyles}>{section.rawText}</pre>}
          {section.rows && section.rows.length > 0 ? (
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>{title.includes('Workout') ? 'Day' : 'Meal'}</th>
                  <th style={thStyles}>Details</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={tdStyles}>{row.day || row.meal}</td>
                    <td style={tdStyles}>{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      ));
    } catch (error) {
      return <p style={errorStyles}>Error parsing plan: {error.message}</p>;
    }
  };

  return (
    <div style={resultContainerStyles}>
      <h2>{title}</h2>
      <p>{data.message}</p>
      {data.error && <p style={errorStyles}>Error Details: {data.error}</p>}
      {data.workoutPlan && renderTable(data.workoutPlan)}
      {data.nutritionPlan && renderTable(data.nutritionPlan)}
    </div>
  );
}

export default ResultDisplay;