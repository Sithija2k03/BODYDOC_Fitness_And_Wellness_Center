import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/user/login', formData);
      console.log('Login response:', response.data);

      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      const userRole = response.data.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignUpClick = () => {
    navigate('/register'); // Navigate to the register route
  };

  return (
    <div style={styles.container}>
      {/* Left Section: BodyDoc Features */}
      <div style={styles.leftSection}>
        {/* Add the photo */}
        <div style={styles.imageContainer}>
          <img
            src="/img/login.jpg"
            alt="BodyDoc Health and Fitness"
            style={styles.image}
          />
        </div>
        <h1 style={styles.heading}>One Account, All BodyDoc</h1>
        <p style={styles.subHeading}>
          Sign into your BodyDoc account and access everything you need from one portal, powered by AI!
        </p>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>🩺 Schedule and manage your medical appointments</li>
          <li style={styles.featureItem}>📊 Track your health records and vitals with AI analysis</li>
          <li style={styles.featureItem}>💊 Access the pharmacy with AI-driven medication reminders</li>
          <li style={styles.featureItem}>🏊 Enjoy the swimming pool and stay active</li>
          <li style={styles.featureItem}>🎱 Relax at the pool lounge with pool tables</li>
          <li style={styles.featureItem}>🏸 Play badminton for fun and fitness</li>
          <li style={styles.featureItem}>💪 Work out at the gym with AI-optimized routines</li>
          <li style={styles.featureItem}>🤖 Get personalized health insights with BodyDoc AI</li>
          <li style={styles.featureItem}>🌐 Access real-time wellness updates and event info</li>
        </ul>
      </div>

      {/* Right Section: Login Form */}
      <div style={styles.rightSection}>
        <h2 style={styles.formHeading}>Account Login</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Please enter your email"
            required
            style={styles.input}
            onChange={handleChange}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              style={styles.input}
              onChange={handleChange}
            />
          </div>

          <div style={styles.optionsContainer}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={styles.checkbox} /> Remember Me
            </label>
            <a href="#" style={styles.forgotPassword}>Forgot your password?</a>
          </div>

          <button type="submit" style={styles.button}>SIGN IN</button>
        </form>

        <p style={styles.signUpText}>
          Don’t Have a BodyDoc Account?{' '}
          <span onClick={handleSignUpClick} style={styles.signUpLink}>
            Sign Up Now
          </span>
        </p>

        <div style={styles.dividerContainer}>
          <span style={styles.dividerText}>Or Sign In With</span>
        </div>

        <div style={styles.socialButtons}>
          <button style={styles.socialButton}><span style={styles.socialIcon}>f</span></button>
          <button style={styles.socialButton}><span style={styles.socialIcon}></span></button>
          <button style={styles.socialButton}><span style={styles.socialIcon}>G</span></button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    backgroundColor: '#f9f9f9',
  },
  leftSection: {
    flex: 0.8,
    backgroundColor: 'white',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  image: {
    width: '80%',
    maxWidth: '300px',
    height: 'auto',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
  },
  featureList: {
    listStyleType: 'none',
    padding: 0,
  },
  featureItem: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '10px',
  },
  rightSection: {
    flex: 1.2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  formHeading: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    color: 'red',
    fontSize: '16px',
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '15px',
  },
  passwordContainer: {
    position: 'relative',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '16px',
    color: '#333',
  },
  checkbox: {
    marginRight: '5px',
  },
  forgotPassword: {
    fontSize: '16px',
    color: '#007bff',
    textDecoration: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#F56692',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer', // Added to indicate it's clickable
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0',
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: '16px',
    color: '#333',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    padding: '0 10px',
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  socialButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: '20px',
    color: '#333',
  },
};

export default Login;