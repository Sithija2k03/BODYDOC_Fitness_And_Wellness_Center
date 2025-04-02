import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: 'male',
    dateOfBirth: '',
    phone: '',
    role: 'member' 
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:4000/user/add', formData);
      setMessage(response.data.message);
      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.heading}>SIGN UP</h1>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input type="text" name="fullName" placeholder="Enter Full Name" required style={styles.input} onChange={handleChange} />

          <label style={styles.label}>Email</label>
          <input type="email" name="email" placeholder="Enter Email" required style={styles.input} onChange={handleChange} />

          <label style={styles.label}>Password</label>
          <input type="password" name="password" placeholder="Enter Password" required style={styles.input} onChange={handleChange} />

          <label style={styles.label}>Gender</label>
          <select name="gender" required style={styles.input} onChange={handleChange} value={formData.gender}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          </select>
 
          
          
          <label style={styles.label}>Date of Birth</label>
          <input type="date" name="dateofBirth" required style={styles.input} onChange={handleChange} />


          <label style={styles.label}>Phone</label>
          <input type="text" name="phone" placeholder="Enter Phone" required style={styles.input} onChange={handleChange} />

          <label style={styles.label}>Role</label>
          <select name="role" required style={styles.input} onChange={handleChange} value={formData.role}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="trainer">Trainer</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="receiptionist">Receiptionist</option>
          </select>

          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg,rgba(229, 220, 220, 0.79), #FAD0C4)', // Soft gradient background
  },
  form: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
    width: '400px',
    backdropFilter: 'blur(8px)', // Glassmorphism effect
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  message: {
    textAlign: 'center',
    color: 'green',
    fontSize: '14px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(5px)',
    transition: '0.3s',
    boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.1)',
  },
  inputFocus: {
    outline: 'none',
    border: '2px solid #FF758C',
    boxShadow: '0px 0px 8px rgba(255, 117, 140, 0.8)',
  },
  button: {
    marginTop: '15px',
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #FF758C, #FF7EB3)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  buttonHover: {
    background: 'linear-gradient(135deg, #FF5A79, #FF6492)',
    boxShadow: '0px 4px 10px rgba(255, 91, 121, 0.5)',
  },
};


export default Register;
