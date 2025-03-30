import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/user/login', formData);
  
      // Log the response to check if you get the expected data
      console.log('Login response:', response);
  
      // Save user data and token
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
  
      // Get role from response and navigate accordingly
      const userRole = response.data.role;  // Directly accessing role from response
      if (userRole === 'admin' || userRole === 'doctor' ) {
        navigate('/admin/dashboard');  // Admin goes to the dashboard
      } else {
        navigate('/user-profile');  // Other roles go to the user profile
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.heading}>Login</h1>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter Email" 
            required 
            style={styles.input} 
            onChange={handleChange} 
          />

          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter Password" 
            required 
            style={styles.input} 
            onChange={handleChange} 
          />

          <button type="submit" style={styles.button}>Login</button>
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
    backgroundColor: '#f9f9f9'
  },
  form: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    width: '380px'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  message: {
    textAlign: 'center',
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px'
  },
  button: {
    marginTop: '15px',
    width: '100%',
    padding: '12px',
    backgroundColor: 'lightgreen',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

export default Login;
