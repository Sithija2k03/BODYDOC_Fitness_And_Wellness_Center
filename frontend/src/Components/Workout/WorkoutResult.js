import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultDisplay = ({ title, data }) => {
  const printRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('exercise'); // Default sort by exercise
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const input = printRef.current;
      const weekSections = input.querySelectorAll('.week-section');

      for (let i = 0; i < weekSections.length; i++) {
        const section = weekSections[i];
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

        const canvas = await html2canvas(weekSections[i], { scale: 2 });
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

  const filterWorkoutData = () => {
    if (!data || !data.workoutPlan || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    const filteredData = { ...data, workoutPlan: [] };

    filteredData.workoutPlan = data.workoutPlan.map((week) => {
      const filteredWeek = { ...week, days: {} };
      Object.keys(week.days).forEach((day) => {
        filteredWeek.days[day] = week.days[day].filter((entry) =>
          entry.exercise.toLowerCase().includes(query) ||
          entry.sets.toString().toLowerCase().includes(query) ||
          entry.reps.toString().toLowerCase().includes(query) ||
          entry.notes.toLowerCase().includes(query)
        );
      });
      return filteredWeek;
    }).filter((week) =>
      Object.values(week.days).some((day) => day.length > 0)
    );

    return filteredData;
  };

  const sortItems = (items, field, order) => {
    return [...items].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';

      // Handle numeric fields like sets and reps
      if (field === 'sets' || field === 'reps') {
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

  const transformToWeeklyFormat = (weeklyData) => {
    return weeklyData.map((week) => {
      const sortedDays = {};
      Object.keys(week.days).forEach((day) => {
        sortedDays[day] = sortItems(week.days[day], sortField, sortOrder);
      });

      const rows = {
        Exercise: {},
        Sets: {},
        Reps: {},
        Notes: {}
      };
      Object.keys(sortedDays).forEach((day) => {
        sortedDays[day].forEach((entry, index) => {
          rows.Exercise[day] = rows.Exercise[day] || [];
          rows.Sets[day] = rows.Sets[day] || [];
          rows.Reps[day] = rows.Reps[day] || [];
          rows.Notes[day] = rows.Notes[day] || [];
          rows.Exercise[day][index] = entry.exercise;
          rows.Sets[day][index] = entry.sets;
          rows.Reps[day][index] = entry.reps;
          rows.Notes[day][index] = entry.notes;
        });
      });
      return { section: week.section, rows };
    });
  };

  const renderWeeklyTable = (weeklyData) => {
    if (!weeklyData || weeklyData.length === 0) {
      return <p style={noDataStyle}>No workout plan data available.</p>;
    }

    const formattedData = transformToWeeklyFormat(weeklyData);
    return formattedData.map((week, index) => (
      <div key={index} className="week-section" style={weekContainerStyle}>
        <h3 style={sectionHeaderStyle}>{week.section}</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Detail</th>
              {Object.keys(week.rows.Exercise).map((day) => (
                <th key={day} style={tableHeaderStyle}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['Exercise', 'Sets', 'Reps', 'Notes'].map((category, rowIndex) => (
              <tr key={category} style={rowIndex % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tableCellStyle}>{category}</td>
                {Object.keys(week.rows.Exercise).map((day) => (
                  <td key={day} style={tableCellStyle}>
                    {week.rows[category][day]?.length > 0 ? (
                      week.rows[category][day].map((item, idx) => (
                        <div key={idx} style={cellContentStyle}>
                          {item || '-'}
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
    ));
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
    marginBottom: '20px',
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
    borderBottom: '2px solid rgb(172, 116, 164)',
  };

  const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    fontSize: '14px',
    verticalAlign: 'top',
    minWidth: '100px',
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
    top: '10px',
    right: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: '10px',
    flexWrap: 'wrap',
    maxWidth: '600px',
  };

  const searchContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '150px',
    flex: '1',
  };

  const sortContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    flexWrap: 'wrap',
    flex: '1',
  };

  const sortGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '120px',
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#333',
    fontWeight: '500',
  };

  const inputStyle = {
    padding: '6px',
    fontSize: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    background: 'url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\"><path fill=\"%23333\" d=\"M7 10l5 5 5-5z\"/></svg>") no-repeat right 8px center',
    backgroundSize: '10px',
    paddingRight: '24px',
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

  const filteredData = filterWorkoutData();

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
            placeholder="Search by exercise, sets, reps, or notes"
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
              <option value="exercise">🔤 Exercise</option>
              <option value="sets">🏋️ Sets</option>
              <option value="reps">🔢 Reps</option>
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
        {filteredData && filteredData.workoutPlan ? (
          <div style={responsiveTableStyle}>
            {renderWeeklyTable(filteredData.workoutPlan)}
          </div>
        ) : (
          <p style={noDataStyle}>No workout plan data available.</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;