import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import Navigation from '../../Components/Navigation/Navigation';
import { useNavigate } from 'react-router-dom';

function SensorDataPage() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetching sensor data
  async function fetchSensorData() {
    try {
      const res = await fetch('http://localhost:4000/sensors/latest');
      const data = await res.json();
      setSensorData(data);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSensorData(); // Initial fetch

    // Set up auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchSensorData();
    }, 10000); // 10000ms = 10 seconds

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <MainLayout>
      <div className="page-content">
        <Navigation />
        <SensorDataStyled>
          <InnerLayout>
            <h1>Latest Sensor Dataset</h1>
            <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

            {loading ? (
              <p>Loading sensor data...</p>
            ) : sensorData ? (
              <table>
                <thead>
                  <tr>
                    <th>Sensor</th>
                    <th>Distance (cm)</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sensor 1</td>
                    <td>{sensorData.sensor1 ?? 'N/A'}</td>
                    <td>{sensorData.timestamp ? new Date(sensorData.timestamp).toLocaleString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Sensor 2</td>
                    <td>{sensorData.sensor2 ?? 'N/A'}</td>
                    <td>{sensorData.timestamp ? new Date(sensorData.timestamp).toLocaleString() : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No sensor data available.</p>
            )}
          </InnerLayout>
        </SensorDataStyled>
      </div>
    </MainLayout>
  );
}

// Styled Components
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

const SensorDataStyled = styled.div`
  flex: 1;
  padding: 2rem;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .back-btn {
    background: #f56692;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    margin-bottom: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 2rem;
  }

  th, td {
    padding: 0.8rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    background-color: #f2f2f2;
    font-weight: 600;
  }

  td {
    background-color: #fafafa;
  }

  p {
    text-align: center;
    margin-top: 2rem;
    font-size: 1rem;
    color: #666;
  }
`;

export default SensorDataPage;
