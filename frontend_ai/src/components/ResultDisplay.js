
import React from 'react';

function ResultDisplay({ title, data }) {
  // Enhanced styling with modern design elements
  const resultContainerStyles = { 
    padding: '25px', 
    border: '1px solid #e0e0e0', 
    borderRadius: '8px', 
    marginTop: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    maxWidth: '100%',
    overflow: 'auto'
  };
  
  const titleStyles = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  };
  
  const messageStyles = {
    fontSize: '16px',
    color: '#444',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff'
  };
  
  const tableStyles = { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };
  
  const thStyles = { 
    backgroundColor: '#f0f7ff', 
    padding: '12px 15px', 
    border: '1px solid #ddd', 
    textAlign: 'left',
    color: '#0056b3',
    fontSize: '16px',
    fontWeight: '600'
  };
  
  const tdStyles = { 
    padding: '12px 15px', 
    border: '1px solid #ddd',
    fontSize: '15px',
    lineHeight: '1.5'
  };
  
  const errorStyles = { 
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '15px',
    borderLeft: '4px solid #dc3545'
  };
  
  const preStyles = { 
    whiteSpace: 'pre-wrap', 
    backgroundColor: '#f8f9fa', 
    padding: '15px', 
    borderRadius: '5px',
    border: '1px solid #e9ecef',
    fontSize: '14px',
    lineHeight: '1.6',
    overflowX: 'auto'
  };
  
  const sectionTitleStyles = {
    fontSize: '20px',
    fontWeight: '500',
    color: '#0056b3',
    margin: '20px 0 10px 0',
    paddingBottom: '8px',
    borderBottom: '1px solid #dee2e6'
  };
  
  const tableContainerStyles = {
    marginBottom: '25px',
    overflowX: 'auto'
  };

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
        <div key={index} style={tableContainerStyles}>
          {section.section && <h3 style={sectionTitleStyles}>{section.section}</h3>}
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
                  <tr key={rowIndex} style={{backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9f9f9'}}>
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
      <h2 style={titleStyles}>{title}</h2>
      {data.message && <p style={messageStyles}>{data.message}</p>}
      {data.error && <p style={errorStyles}>Error Details: {data.error}</p>}
      {data.workoutPlan && renderTable(data.workoutPlan)}
      {data.nutritionPlan && renderTable(data.nutritionPlan)}
    </div>
  );
}

export default ResultDisplay;
