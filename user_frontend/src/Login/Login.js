import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/user-profile');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setMessage('Invalid email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/user/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      const userRole = response.data.role;
      if (userRole === 'member') {
        navigate('/user-profile');
      } else if (['admin', 'doctor', 'trainer', 'pharmacist', 'receptionist'].includes(userRole)) {
        navigate('/user-profile'); // Redirect to admin dashboard
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
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
            value={formData.email} 
            onChange={handleChange} 
          />

          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter Password" 
            required 
            style={styles.input} 
            value={formData.password} 
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
