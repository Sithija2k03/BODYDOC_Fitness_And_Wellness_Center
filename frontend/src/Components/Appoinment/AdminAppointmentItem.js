import React, { useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function AdminAppointment({ id, userId, userName, doctorName, timeSlot, date }) {
  const fileInputRef = useRef(null);

  // Static adminId set here
  const staticAdminId = '680633e28b7652df112c297b';  // Provided admin MongoDB ID

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const staticAdminId = "680633e28b7652df112c297b";  // Static Admin ID
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userId = currentUser?._id;  // Assuming the userId comes from the logged-in user
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', staticAdminId);  // Static Admin ID
    formData.append('receiverId', userId);      // User ID
    formData.append('text', `Prescription for your appointment with Dr. ${doctorName}`);
  
    try {
      const response = await axios.post('http://localhost:4000/messages/sendPrescription', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Prescription sent successfully:", response.data);
      alert('Prescription sent successfully!');
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert('Failed to send prescription.');
    }
  };
  

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <AppointmentCard>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#{id}</td>
              <td>{userName}</td>
              <td>{doctorName}</td>
              <td>{formattedDate}</td>
              <td>{timeSlot}</td>
              <td>
                <button onClick={openFileDialog}>Send Prescription</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }}
                  accept="application/pdf"
                  onChange={handleFileUpload}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppointmentCard>
  );
}

// 🧩 Add this styled-component below:

const AppointmentCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 20px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 600;
  }

  button {
    background-color: #F56692;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:hover {
    background-color: #d84c77;
  }
`;

export default AdminAppointment;
