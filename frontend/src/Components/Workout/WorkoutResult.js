import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultDisplay = ({ title, data }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const input = printRef.current;
    const weekSections = input.querySelectorAll('.week-section');
  
    for (let i = 0; i < weekSections.length; i++) {
      const canvas = await html2canvas(weekSections[i], { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
  
    pdf.save(`${title}.pdf`);
  };
  

  const transformToWeeklyFormat = (weeklyData) => {
    return weeklyData.map((week) => {
      const rows = {
        Exercise: {},
        Sets: {},
        Reps: {},
        Notes: {}
      };
      Object.keys(week.days).forEach((day) => {
        week.days[day].forEach((entry, index) => {
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
                    {week.rows[category][day].map((item, idx) => (
                      <div key={idx} style={cellContentStyle}>
                        {item || '-'}
                      </div>
                    ))}
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
        {data && data.workoutPlan ? (
          <div style={responsiveTableStyle}>
            {renderWeeklyTable(data.workoutPlan)}
          </div>
        ) : (
          <p style={noDataStyle}>No workout plan data available.</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
