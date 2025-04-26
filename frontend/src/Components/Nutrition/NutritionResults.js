import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const NutritionResults = ({ title, data }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const input = printRef.current;
    const sections = input.querySelectorAll('.nutrition-section');

    for (let i = 0; i < sections.length; i++) {
      const canvas = await html2canvas(sections[i], { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`${title}.pdf`);
  };

  const transformToWeeklyFormat = (nutritionData) => {
    console.log('Transforming nutrition data:', nutritionData); // Debug log

    // Since we know there's only 1 week, we can simplify the structure
    const week = {
      section: 'Week 1: Foundation',
      days: {
        Monday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Tuesday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Wednesday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Thursday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Friday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Saturday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
        Sunday: { Breakfast: [], Lunch: [], Dinner: [], 'Snack 1': [] },
      },
    };

    nutritionData.forEach((item) => {
      const cleanedMeal = item.Meal.replace(/\*\*/g, '').trim();

      // Skip the week header and totals
      if (cleanedMeal.match(/^Week \d+:/) || cleanedMeal === 'Totals') {
        if (cleanedMeal.match(/^Week \d+:/)) {
          week.section = cleanedMeal; // Update section name if needed
        }
        return;
      }

      // Handle meal entries
      if (cleanedMeal.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(Breakfast|Lunch|Dinner|Snack)/)) {
        const [day, mealType] = cleanedMeal.split(/\s+(?=\bBreakfast\b|\bLunch\b|\bDinner\b|\bSnack\b)/);
        const adjustedMealType = mealType === 'Snack' ? 'Snack 1' : mealType; // Only Snack 1 since backend provides 1 snack

        const mealEntry = {
          food: item.Food || '-',
          calories: item.Calories || '-',
          protein: item['Protein (g)'] || '-',
          carbs: item['Carbs (g)'] || '-',
          fats: item['Fats (g)'] || '-',
        };
        week.days[day][adjustedMealType].push(mealEntry);
      }
    });

    console.log('Transformed weekly data:', week); // Debug log
    return week;
  };

  const renderWeeklyTable = (weeklyData) => {
    if (!weeklyData || weeklyData.length === 0) {
      return <p style={noDataStyle}>No nutrition plan data available.</p>;
    }

    const week = transformToWeeklyFormat(weeklyData);
    if (!week || !week.days) {
      return <p style={noDataStyle}>No weekly nutrition data available.</p>;
    }

    const rows = {
      Breakfast: {},
      Lunch: {},
      Dinner: {},
      'Snack 1': {},
    };

    Object.keys(week.days).forEach((day) => {
      Object.keys(rows).forEach((mealType) => {
        rows[mealType][day] = week.days[day][mealType] || [];
      });
    });

    return (
      <div className="nutrition-section" style={weekContainerStyle}>
        <h3 style={sectionHeaderStyle}>{week.section}</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Detail</th>
              {Object.keys(week.days).map((day) => (
                <th key={day} style={tableHeaderStyle}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack 1'].map((mealType, rowIndex) => (
              <tr key={mealType} style={rowIndex % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tableCellStyle}>{mealType}</td>
                {Object.keys(week.days).map((day) => (
                  <td key={day} style={tableCellStyle}>
                    {rows[mealType][day].length > 0 ? (
                      rows[mealType][day].map((item, idx) => (
                        <div key={idx} style={cellContentStyle}>
                          {item.food !== '-' ? item.food : 'No Meal'}<br />
                          {item.calories !== '-' && `Calories: ${item.calories}`}<br />
                          {item.protein !== '-' && `Protein: ${item.protein} g`}<br />
                          {item.carbs !== '-' && `Carbs: ${item.carbs} g`}<br />
                          {item.fats !== '-' && `Fats: ${item.fats} g`}
                        </div>
                      ))
                    ) : (
                      <div style={cellContentStyle}>-</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTotalsTable = (nutritionData) => {
    const totals = nutritionData.find((item) => item.Meal === '**Totals**') || {};
    return (
      <div className="nutrition-section" style={weekContainerStyle}>
        <h3 style={sectionHeaderStyle}>Totals (1 Week)</h3> {/* Updated header */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Metric</th>
              <th style={tableHeaderStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={evenRowStyle}>
              <td style={tableCellStyle}>Total Calories</td>
              <td style={tableCellStyle}>{totals.Calories || '-'} kcal</td>
            </tr>
            <tr style={oddRowStyle}>
              <td style={tableCellStyle}>Total Protein</td>
              <td style={tableCellStyle}>{totals['Protein (g)'] || '-'} g</td>
            </tr>
            <tr style={evenRowStyle}>
              <td style={tableCellStyle}>Total Carbs</td>
              <td style={tableCellStyle}>{totals['Carbs (g)'] || '-'} g</td>
            </tr>
            <tr style={oddRowStyle}>
              <td style={tableCellStyle}>Total Fats</td>
              <td style={tableCellStyle}>{totals['Fats (g)'] || '-'} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderTipsTable = (tips) => {
    console.log('Rendering tips:', tips); // Debug log
    return (
      <div className="nutrition-section" style={weekContainerStyle}>
        <h3 style={sectionHeaderStyle}>Additional Recommendations</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {tips && tips.length > 0 ? (
              tips.map((tip, index) => (
                <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                  <td style={tableCellStyle}>{tip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tableCellStyle}>No additional tips provided.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // CSS Styles (unchanged)
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    color: '#333',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50',
  };

  const weekContainerStyle = {
    marginBottom: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const sectionHeaderStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '15px',
    textAlign: 'left',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const tableHeaderStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '16px',
    borderBottom: '2px solid #2980b9',
  };

  const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    fontSize: '14px',
    verticalAlign: 'top',
    minWidth: '120px',
  };

  const evenRowStyle = {
    backgroundColor: '#f2f2f2',
  };

  const oddRowStyle = {
    backgroundColor: '#fff',
  };

  const cellContentStyle = {
    marginBottom: '5px',
    lineHeight: '1.5',
  };

  const noDataStyle = {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '16px',
    marginTop: '20px',
  };

  const responsiveTableStyle = {
    ...tableStyle,
    display: 'block',
    overflowX: 'auto',
  };

  const downloadButtonStyle = {
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <button onClick={handleDownloadPDF} style={downloadButtonStyle}>
        Download as PDF
      </button>
      <div ref={printRef}>
        {data ? (
          <>
            <div style={responsiveTableStyle}>
              {renderWeeklyTable(data.nutritionPlan)}
            </div>
            {renderTotalsTable(data.nutritionPlan)}
            {renderTipsTable(data.tips)}
          </>
        ) : (
          <p style={noDataStyle}>No nutrition plan data available.</p>
        )}
      </div>
    </div>
  );
};

export default NutritionResults;