import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ email: '', password: '' });
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const payload = {
        email: formData.email.trim().toLowerCase(), // Normalize email to lowercase
        password: formData.password
      };
      console.log("Sending login request:", payload);
      const response = await axios.post('http://localhost:4000/user/login', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login response:', response.data);

      if (!response.data.token || !response.data.role) {
        throw new Error('Invalid response: Missing token or role');
      }

      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      const userRole = response.data.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      const errorMessage = error.response?.status === 401
        ? 'Invalid email or password. Please check your credentials.'
        : error.response?.data?.error || 'Login failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.imageContainer}>
          <img
            src={process.env.PUBLIC_URL + '/img/login.jpg'}
            alt="BodyDoc Health and Fitness"
            style={styles.image}
            onError={() => console.error('Failed to load login.jpg')}
          />
        </div>
        {/* ... rest of the left section ... */}
      </div>
      <div style={styles.rightSection}>
        <h2 style={styles.formHeading}>Account Login</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Please enter your email"
            value={formData.email}
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
              value={formData.password}
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
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'SIGN IN'}
          </button>
        </form>
        <p style={styles.signUpText}>
          Do not have an Account ?{' '}
          <span onClick={() => navigate('/register')} style={styles.signUpLink}>
            Sign Up Now
          </span>
        </p>
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