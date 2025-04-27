import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus, search, fileText } from '../../utils/icons';
import Modal from '../Modal/Modal';
import Navigation from '../../Components/Navigation/Navigation'; // Include Navigation component
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios'; // To fetch sensor data

function SensorAvailability() {
  const [sensorData, setSensorData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sensor availability data from the backend
    axios.get('http://localhost:4000/sensors/get-sensor')
      .then(response => {
        setSensorData(response.data);
      })
      .catch(err => {
        console.error('Error fetching sensor data:', err);
      });
  }, []);

  const filteredSensorData = sensorData.filter(item =>
    item?.sensor1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.sensor2?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Sensor 1', 'Sensor 2', 'Timestamp']],
      body: filteredSensorData.map(item => [
        item.sensor1 || 'N/A',
        item.sensor2 || 'N/A',
        new Date(item.timestamp).toLocaleString() || 'N/A',
      ]),
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [245, 102, 146],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { top: 30 },
      didDrawPage: (data) => {
        doc.setFontSize(18);
        doc.text('Sensor Availability Report', 14, 22);
      },
    });
    doc.save('sensor-availability-report.pdf');
  };

  // Inline SensorItem component
  const SensorItem = ({ sensor1, sensor2, timestamp }) => {
    return (
      <tr>
        <td>{sensor1 || 'N/A'}</td>
        <td>{sensor2 || 'N/A'}</td>
        <td>{new Date(timestamp).toLocaleString() || 'N/A'}</td>
      </tr>
    );
  };

  return (
    <MainLayout>
      <div className="page-content">
        <Navigation />
        <SensorAvailabilityStyled>
          <InnerLayout>
            <h1>Sensor Availability</h1>
            <SearchBarContainer>
              <input
                type="text"
                placeholder="Search sensor by availability..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-icon">{search}</div>
            </SearchBarContainer>
            <div className="submit-btn">
              <Button
                name={'Generate PDF'}
                icon={fileText}
                bPad={'.8rem 1.6rem'}
                bRad={'30px'}
                bg={'#F56692'}
                color={'#fff'}
                onClick={generatePDF}
              />

            </div>
            <div className="sensor-availability-list">
              {sensorData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Sensor 1</th>
                      <th>Sensor 2</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSensorData.length > 0 ? (
                      filteredSensorData.map((item, index) => (
                        <SensorItem
                          key={index}
                          sensor1={item.sensor1}
                          sensor2={item.sensor2}
                          timestamp={item.timestamp}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No sensor data matches your search</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p>No sensor data available</p>
              )}
            </div>
          </InnerLayout>
        </SensorAvailabilityStyled>
      </div>
    </MainLayout>
  );
}

// Styled components for Sensor Availability page

const MainLayout = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, rgba(245, 102, 146, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%);
  padding: 2rem;

  .page-content {
    display: flex;
    flex: 1;
    background: white;
    border-radius: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  > .page-content > nav {
    width: 250px;
    min-width: 250px;
    background-color: #f8f8f8;
    height: 100%;
  }

  > .page-content > div {
    flex: 1;
    overflow-y: auto;
  }
`;

// Styled components for Sensor Availability page

const SensorAvailabilityStyled = styled.div`
  flex: 1;

  .submit-btn {
    margin: 1rem 0;
    display: flex;
    justify-content: flex-start; /* Align to the left */
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .sensor-availability-list {
    margin-top: 1rem;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    background-color: #f2f2f2;
    font-weight: 600;
    width: 20%;
  }

  td {
    background-color: #fafafa;
  }

  tr:hover td {
    background-color: #f0f0f0;
  }

  p {
    text-align: center;
    font-size: 1rem;
    color: #666;
    margin: 2rem 0;
  }
`;



const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 15px;

  input {
    background: #ffffff;
    width: 100%;
    max-width: 400px;
    padding: 10px 40px 10px 10px;
    border: 2px solid #228b22;
    border-radius: 20px;
    font-size: 1rem;
    outline: none;
    transition: 0.3s ease-in-out;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 5px var(--color-primary);
    }
  }

  .search-icon {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 790px;
    top: 160px;
    color: var(--color-primary);
    cursor: pointer;
  }
`;

export default SensorAvailability;
