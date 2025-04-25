import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { useNavigate, useLocation } from "react-router-dom";
import Header from '../../Login/Header';
import Button from '../AppoinmentLayout/Button';

const containerStyle = {
  width: '400px',
  margin: '50px auto',
  padding: '30px',
  background: '#bab2b2',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {
  width: '150px',
  height: 'auto',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
};

const errorTextStyle = {
  color: 'red',
  fontSize: '14px',
  marginBottom: '10px',
};

const errorBorderStyle = {
  border: '1px solid red',
};

const buttonStyle = {
  backgroundColor: '#F56692',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const buttonHoverStyle = {
  backgroundColor: '#dd275e',
};

const OrderForm = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { addOrder } = useGlobalContext();
  const location = useLocation();

  const [userName, setUserName] = useState(state?.userName || '');
  const [doctorName, setDoctorName] = useState(state?.doctorName || '');
  const [prescriptionFile, setPrescriptionFile] = useState(null); // Changed to store file
  const [cDate, setCDate] = useState(state?.cDate || '');
  const [existingPrescriptionName, setExistingPrescriptionName] = useState(state?.prescription || ''); // To retain the existing prescription file name
  const [errors, setErrors] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (location.state) {
      console.log("Location State:", location.state);
      const { userName, doctorName, cDate, prescription } = location.state;
      setUserName(userName || '');
      setDoctorName(doctorName || '');
      setCDate(cDate ? new Date(cDate).toISOString().split('T')[0] : '');
      setExistingPrescriptionName(prescription || ''); // Set existing prescription file name
    }
  }, [location.state]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    const invalidChars = /[@!~#$%^&*<>1234567890]/;

    if (!userName.trim()) {
      errors.userName = "User Name is required!";
      isValid = false;
    } else if (invalidChars.test(userName)) {
      errors.userName = "User Name cannot contain @, !, #, %, ^, &, *, or numbers!";
      isValid = false;
      alert("Invalid username! Please do not use special characters or numbers.");
    }

    if (!doctorName.trim()) {
      errors.doctorName = "Doctor Name is required!";
      isValid = false;
    } else if (invalidChars.test(doctorName)) {
      errors.doctorName = "Doctor Name cannot contain @, !, #, %, ^, &, *, or numbers!";
      isValid = false;
      alert("Invalid doctorName! Please do not use special characters or numbers.");
    }

    if (!cDate) {
      errors.cDate = "Consultation Date is required!";
      isValid = false;
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (cDate < today) {
        errors.cDate = "Date cannot be in the past!";
        isValid = false;
      }
    }

    if (!prescriptionFile && !existingPrescriptionName) {  // Check if there’s no file uploaded and no existing file name
      errors.prescription = "Prescription PDF file is required!";
      isValid = false;
    } else if (prescriptionFile && !prescriptionFile.name.toLowerCase().endsWith('.pdf')) {
      errors.prescription = "Only PDF files are allowed!";
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setErrors(errors);
      return;
    }

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('doctor_name', doctorName);
    formData.append('c_date', cDate);

    // If a new prescription file is selected, append it, otherwise append the existing file
    if (prescriptionFile) {
      formData.append('prescription', prescriptionFile);
    } else {
      formData.append('prescription', existingPrescriptionName); // Append the existing prescription file
    }

    try {
      await addOrder(formData);
      setUserName('');
      setDoctorName('');
      setCDate('');
      setPrescriptionFile(null);
      setErrors({});
      alert("Order placed successfully!");
      // Reset the file input
      document.getElementById('prescription').value = null;
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/img/bodydoc.png" alt="Logo" style={logoStyle} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Place a New Order</h2>

        <form onSubmit={handleSubmit} noValidate style={formStyle}>
          <label htmlFor="user_name" style={labelStyle}>User Name:</label>
          <input
            type="text"
            id="user_name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ ...inputStyle, ...(errors.userName ? errorBorderStyle : {}) }}
          />
          {errors.userName && <span style={errorTextStyle}>{errors.userName}</span>}

          <label htmlFor="doctor_name" style={labelStyle}>Doctor Name:</label>
          <input
            type="text"
            id="doctor_name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            style={{ ...inputStyle, ...(errors.doctorName ? errorBorderStyle : {}) }}
          />
          {errors.doctorName && <span style={errorTextStyle}>{errors.doctorName}</span>}

          <label htmlFor="c_date" style={labelStyle}>Consultation Date:</label>
          <input
            type="date"
            id="c_date"
            value={cDate}
            onChange={(e) => setCDate(e.target.value)}
            style={{ ...inputStyle, ...(errors.cDate ? errorBorderStyle : {}) }}
          />
          {errors.cDate && <span style={errorTextStyle}>{errors.cDate}</span>}

          <label htmlFor="prescription" style={labelStyle}>Prescription (PDF only):</label>
          <input
            type="file"
            id="prescription"
            accept="application/pdf"
            onChange={(e) => setPrescriptionFile(e.target.files[0])}
            style={{ ...inputStyle, ...(errors.prescription ? errorBorderStyle : {}) }}
          />
          {errors.prescription && <span style={errorTextStyle}>{errors.prescription}</span>}

          <button
            type="submit"
            style={isHovering ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Update
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={() => navigate("/order-display")}>View My Orders</Button>
        </div>
      </div>
    </>
  );
};

export default OrderForm;
