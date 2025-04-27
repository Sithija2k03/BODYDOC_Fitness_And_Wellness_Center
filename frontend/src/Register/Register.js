import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: 'male',
    dateofBirth: '',
    phone: '',
    role: 'member'
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) {
      return 'Full Name is required';
    }
    if (!nameRegex.test(name)) {
      return 'Full Name should only contain letters and spaces';
    }
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d+$/;
    if (!phone) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phone)) {
      return 'Phone number should only contain digits';
    }
    if (phone.length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const validateDateOfBirth = (dob) => {
    const currentDate = new Date();
    const selectedDate = new Date(dob);
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
    const monthDifference = currentDate.getMonth() - selectedDate.getMonth();

    // Check if date is in the future
    if (selectedDate > currentDate) {
      return 'Date of Birth cannot be in the future';
    }
    // Check if the user is at least 10 years old
    if (age < 10 || (age === 10 && monthDifference < 0)) {
      return 'You must be at least 10 years old';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Validate Full Name
    if (name === 'fullName') {
      newValue = value.replace(/[^A-Za-z\s]/g, ''); // Allow only letters and spaces
      const error = validateFullName(newValue);
      setErrors({ ...errors, fullName: error });
    }
    
    // Validate Phone
    else if (name === 'phone') {
      newValue = value.replace(/\D/g, ''); // Allow only digits
      const error = validatePhone(newValue);
      setErrors({ ...errors, phone: error });
    }
    
    // Validate Date of Birth
    else if (name === 'dateofBirth') {
      const error = validateDateOfBirth(value);
      setErrors({ ...errors, dateofBirth: error });
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullNameError = validateFullName(formData.fullName);
    const phoneError = validatePhone(formData.phone);
    const dateofBirthError = validateDateOfBirth(formData.dateofBirth);

    if (fullNameError || phoneError || dateofBirthError) {
      setErrors({ ...errors, fullName: fullNameError, phone: phoneError, dateofBirth: dateofBirthError });
      return;
    }

    console.log("Submitting Form Data:", formData);
    try {
      const response = await axios.post('http://localhost:4000/user/add', formData);
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error("Registration Error:", error.response?.data || error);
      setMessage(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section: BodyDoc Features */}
      <div style={styles.leftSection}>
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

      {/* Right Section: Registration Form */}
      <div style={styles.rightSection}>
        <h2 style={styles.formHeading}>Sign Up</h2>
        {message && <p style={{ ...styles.message, color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            required
            style={{ ...styles.input, borderColor: errors.fullName ? 'red' : '#ccc' }}
            onChange={handleChange}
            value={formData.fullName}
          />
          {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}

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

          <label style={styles.label}>Gender</label>
          <select
            name="gender"
            required
            style={styles.input}
            onChange={handleChange}
            value={formData.gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="dateofBirth"
            required
            style={{ ...styles.input, borderColor: errors.dateofBirth ? 'red' : '#ccc' }}
            onChange={handleChange}
            value={formData.dateofBirth}
          />
          {errors.dateofBirth && <p style={styles.error}>{errors.dateofBirth}</p>}

          <label style={styles.label}>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter Phone"
            required
            style={{ ...styles.input, borderColor: errors.phone ? 'red' : '#ccc' }}
            onChange={handleChange}
            value={formData.phone}
          />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}

          <label style={styles.label}>Role</label>
          <select
            name="role"
            required
            style={styles.input}
            onChange={handleChange}
            value={formData.role}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="trainer">Trainer</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <button type="submit" style={styles.button}>REGISTER</button>
        </form>

        <p style={styles.signUpText}>
          Already Have a BodyDoc Account?{' '}
          <span onClick={() => navigate('/login')} style={styles.signUpLink}>
            Sign In Now
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '40px',
    overflowY: 'auto',
  },
  formHeading: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    marginTop: '20px',
  },
  message: {
    textAlign: 'center',
    color: 'red',
    fontSize: '16px',
    marginBottom: '10px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '4px',
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
    marginBottom: '20px',
    fontSize: '16px',
    color: '#333',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default Register;
