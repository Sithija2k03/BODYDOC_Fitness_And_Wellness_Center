import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const NutritionResults = ({ title, data }) => {
  const printRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('food'); // Default sort by food
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const input = printRef.current;
      const sections = input.querySelectorAll('.nutrition-section');

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const table = section.querySelector('table');
        const headers = table.querySelectorAll('th');
        const evenRows = table.querySelectorAll('tr:nth-child(even)');
        const oddRows = table.querySelectorAll('tr:nth-child(odd)');
        const sectionHeader = section.querySelector('h3');

        // Apply PDF styles
        sectionHeader.style.backgroundColor = '#34495e';
        sectionHeader.style.color = '#fff';
        headers.forEach((th) => {
          th.style.backgroundColor = '#2c3e50';
          th.style.color = '#fff';
          th.style.borderBottom = '2px solid #1a252f';
        });
        evenRows.forEach((row) => {
          row.style.backgroundColor = '#f5f6fa';
        });
        oddRows.forEach((row) => {
          row.style.backgroundColor = '#ffffff';
        });

        const canvas = await html2canvas(sections[i], { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i !== 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Revert styles to UI colors
        sectionHeader.style.backgroundColor = '';
        sectionHeader.style.color = '#34495e';
        headers.forEach((th) => {
          th.style.backgroundColor = '#6b7280';
          th.style.color = '#fff';
          th.style.borderBottom = '2px solid #4b5563';
        });
        evenRows.forEach((row) => {
          row.style.backgroundColor = '#f2f2f2';
        });
        oddRows.forEach((row) => {
          row.style.backgroundColor = '#fff';
        });
      }

      pdf.save(`${title}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filterNutritionData = () => {
    if (!data || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    const filteredData = { ...data, nutritionPlan: [], tips: [] };

    // Filter nutritionPlan
    filteredData.nutritionPlan = data.nutritionPlan.filter((item) => {
      const cleanedMeal = item.Meal.replace(/\*\*/g, '').trim();
      if (cleanedMeal.match(/^Week \d+:/) || cleanedMeal === 'Totals') {
        return true; // Keep week headers and totals
      }
      return item.Food?.toLowerCase().includes(query);
    });

    // Filter tips
    filteredData.tips = data.tips.filter((tip) =>
      tip.toLowerCase().includes(query)
    );

    return filteredData;
  };

  const sortItems = (items, field, order) => {
    return [...items].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';

      // Handle numeric fields like calories
      if (field === 'calories') {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      } else {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const transformToWeeklyFormat = (nutritionData) => {
    console.log('Transforming nutrition data:', nutritionData);

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

      if (cleanedMeal.match(/^Week \d+:/) || cleanedMeal === 'Totals') {
        if (cleanedMeal.match(/^Week \d+:/)) {
          week.section = cleanedMeal;
        }
        return;
      }

      if (cleanedMeal.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(Breakfast|Lunch|Dinner|Snack)/)) {
        const [day, mealType] = cleanedMeal.split(/\s+(?=\bBreakfast\b|\bLunch\b|\bDinner\b|\bSnack\b)/);
        const adjustedMealType = mealType === 'Snack' ? 'Snack 1' : mealType;

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

    // Sort meals within each day and meal type
    Object.keys(week.days).forEach((day) => {
      Object.keys(week.days[day]).forEach((mealType) => {
        week.days[day][mealType] = sortItems(week.days[day][mealType], sortField, sortOrder);
      });
    });

    console.log('Transformed weekly data:', week);
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
    const query = searchQuery.toLowerCase();
    const metrics = [
      { name: 'Total Calories', value: totals.Calories || '-', unit: 'kcal' },
      { name: 'Total Protein', value: totals['Protein (g)'] || '-', unit: 'g' },
      { name: 'Total Carbs', value: totals['Carbs (g)'] || '-', unit: 'g' },
      { name: 'Total Fats', value: totals['Fats (g)'] || '-', unit: 'g' },
    ]
      .filter((metric) => !query || metric.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const valueA = a.name.toLowerCase();
        const valueB = b.name.toLowerCase();
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

    if (metrics.length === 0) {
      return null;
    }

    return (
      <div className="nutrition-section" style={weekContainerStyle}>
        <h3 style={sectionHeaderStyle}>Totals (1 Week)</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Metric</th>
              <th style={tableHeaderStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr key={metric.name} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tableCellStyle}>{metric.name}</td>
                <td style={tableCellStyle}>{metric.value} {metric.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTipsTable = (tips) => {
    console.log('Rendering tips:', tips);
    const filteredTips = tips && tips.length > 0 ? tips : ['No additional tips provided.'];
    const sortedTips = [...filteredTips].sort((a, b) => {
      const valueA = a.toLowerCase();
      const valueB = b.toLowerCase();
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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
            {sortedTips.map((tip, index) => (
              <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tableCellStyle}>{tip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // CSS Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    color: '#333',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px', // Reduced to bring controls closer
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
    backgroundColor: '#6b7280',
    color: '#fff',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '16px',
    borderBottom: '2px solid #4b5563',
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
    backgroundColor: isGeneratingPDF ? '#cccccc' : '#e04e7e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
    fontSize: '16px',
  };

  const controlsContainerStyle = {
    position: 'absolute',
    top: '10px', // Close to the title
    right: '20px', // Align to right corner
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: '10px', // Reduced gap for compactness
    flexWrap: 'wrap',
    maxWidth: '600px', // Prevent controls from spreading too wide
  };

  const searchContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px', // Smaller gap
    minWidth: '150px', // Smaller minimum width
    flex: '1',
  };

  const sortContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px', // Smaller gap
    flexWrap: 'wrap',
    flex: '1',
  };

  const sortGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px', // Smaller gap
    minWidth: '120px', // Smaller minimum width
  };

  const sortInfoStyle = {
    fontSize: '12px', // Smaller font
    color: '#34495e',
    marginTop: '10px',
    textAlign: 'right', // Align with controls
  };

  const labelStyle = {
    fontSize: '12px', // Smaller font
    color: '#333',
    fontWeight: '500',
  };

  const inputStyle = {
    padding: '6px', // Smaller padding
    fontSize: '12px', // Smaller font
    borderRadius: '6px', // Slightly smaller radius
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    background: 'url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\"><path fill=\"%/scss3\" d=\"M7 10l5 5 5-5z\"/></svg>") no-repeat right 8px center',
    backgroundSize: '10px', // Smaller arrow
    paddingRight: '24px', // Adjusted for smaller arrow
  };

  const loadingOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const filteredData = filterNutritionData();

  // Display sorting method
  const sortFieldDisplay = sortField === 'food' ? 'Food' : 'Calories';
  const sortOrderDisplay = sortOrder === 'asc' ? 'Ascending' : 'Descending';
  const sortInfo = `Sorting by ${sortFieldDisplay} (${sortOrderDisplay})`;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <h2 style={titleStyle}>{title}</h2>
      <div style={controlsContainerStyle}>
        <div style={searchContainerStyle}>
          <label style={labelStyle} htmlFor="searchInput"></label>
          <input
            type="text"
            id="searchInput"
            value={searchQuery}
            onChange={handleSearchChange}
            style={inputStyle}
            placeholder="Search by food, metric, tip..."
            disabled={isGeneratingPDF}
          />
        </div>
        <div style={sortContainerStyle}>
          <div style={sortGroupStyle}>
            <label style={labelStyle} htmlFor="sortField">Sort By</label>
            <select
              id="sortField"
              value={sortField}
              onChange={handleSortFieldChange}
              style={selectStyle}
              disabled={isGeneratingPDF}
            >
              <option value="food">🔤 Food</option>
              <option value="calories">🔥 Calories</option>
            </select>
          </div>
          <div style={sortGroupStyle}>
            <label style={labelStyle} htmlFor="sortOrder">Order</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortOrderChange}
              style={selectStyle}
              disabled={isGeneratingPDF}
            >
              <option value="asc">⬆️ Ascending</option>
              <option value="desc">⬇️ Descending</option>
            </select>
          </div>
        </div>
      </div>
      <p style={sortInfoStyle}>{sortInfo}</p>
      <button
        onClick={handleDownloadPDF}
        style={downloadButtonStyle}
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
      </button>
      {isGeneratingPDF && (
        <div style={loadingOverlayStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
            Generating PDF...
          </p>
        </div>
      )}
      <div ref={printRef}>
        {filteredData ? (
          <>
            <div style={responsiveTableStyle}>
              {renderWeeklyTable(filteredData.nutritionPlan)}
            </div>
            {renderTotalsTable(filteredData.nutritionPlan)}
            {renderTipsTable(filteredData.tips)}
            {filteredData.nutritionPlan.length === 0 &&
              filteredData.tips.length === 0 && (
                <p style={noDataStyle}>No results found for "{searchQuery}".</p>
              )}
          </>
        ) : (
          <p style={noDataStyle}>No nutrition plan data available.</p>
        )}
      </div>
    </div>
  );
};
export default NutritionResults;