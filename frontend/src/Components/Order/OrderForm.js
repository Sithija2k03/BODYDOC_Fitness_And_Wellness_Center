import React, { useState } from "react";


const OrderForm = () => {
  const [user_name, setUserName] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [c_date, setDate] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [errors, setErrors] = useState({}); // State for validation errors

  // Handle file upload validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPrescription(reader.result); // Store as Base64
    };
    
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          prescription: "Invalid file type! Only PDF, JPG, and PNG are allowed.",
        }));
        setPrescription(null);
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          prescription: "File size exceeds 2MB!",
        }));
        setPrescription(null);
        return;
      }

      setErrors((prev) => ({ ...prev, prescription: "" }));
      setPrescription(file);
    }
  };

  // Validate form before submitting
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!user_name.trim()) {
      errors.user_name = "User Name is required!";
      isValid = false;
    }

    if (!doctor_name.trim()) {
      errors.doctor_name = "Doctor Name is required!";
      isValid = false;
    }

    if (!c_date) {
      errors.c_date = "Date is required!";
      isValid = false;
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (c_date < today) {
        errors.c_date = "Date cannot be in the past!";
        isValid = false;
      }
    }

    if (!prescription) {
      errors.prescription = "Prescription file is required!";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("user_name", user_name);
    formData.append("doctor_name", doctor_name);
    formData.append("c_date", c_date);
    formData.append("prescription", prescription);

    try {
      const response = await fetch("http://localhost:8070/order/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response from server:", data);

      // Reset form on success
      setUserName("");
      setDoctorName("");
      setDate("");
      setPrescription(null);
      setErrors({});
      alert("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label htmlFor="user_name">User Name:</label>
      <input
        type="text"
        id="user_name"
        className={errors.user_name ? "error-border" : ""}
        value={user_name}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      {errors.user_name && <span className="error-text">{errors.user_name}</span>}
      <br />

      <label htmlFor="doctor_name">Doctor Name:</label>
      <input
        type="text"
        id="doctor_name"
        className={errors.doctor_name ? "error-border" : ""}
        value={doctor_name}
        onChange={(e) => setDoctorName(e.target.value)}
        required
      />
      {errors.doctor_name && <span className="error-text">{errors.doctor_name}</span>}
      <br />

      <label htmlFor="c_date">Date:</label>
      <input
        type="date"
        id="c_date"
        className={errors.c_date ? "error-border" : ""}
        value={c_date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      {errors.c_date && <span className="error-text">{errors.c_date}</span>}
      <br />

      <label htmlFor="prescription">Upload Prescription:</label>
      <input
        type="file"
        id="prescription"
        accept=".pdf,.jpg,.png"
        className={errors.prescription ? "error-border" : ""}
        onChange={handleFileUpload}
        required
      />
      {errors.prescription && <span className="error-text">{errors.prescription}</span>}
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default OrderForm;
