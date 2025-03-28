import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // Import Header component

function EditProfile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePic: "", // Store the image URL
    
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();



  // Fetch user data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8070/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8070/user/update/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      navigate("/profile"); // Redirect to profile page
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Header activeTab="profile" />
      <div style={styles.container}>
        <h2 style={styles.heading}>Edit Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
           // Prevent users from changing their email
          />

          <label style={styles.label}>Phone:</label>
          <input
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            required
           
          />

          

          <label style={styles.label}>Membership Status:</label>
          <select
            name="membershipStatus"
            value={formData.membershipStatus}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>

          <button type="submit" style={styles.saveButton}>Save Changes</button>
          <button type="button" onClick={() => navigate("/profile")} style={styles.cancelButton}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    width: "50%",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ffffff, #e0f2fe)",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #93c5fd",
    borderRadius: "8px",
    background: "#f1f5f9",
    transition: "all 0.3s ease-in-out",
  },
  saveButton: {
    marginTop: "15px",
    padding: "12px",
    background: "linear-gradient(90deg, #4caf50, #22c55e)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
  },
  saveButtonHover: {
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    transform: "scale(1.05)",
  },
  cancelButton: {
    padding: "12px",
    background: "linear-gradient(90deg, #6c757d, #4b5563)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
  },
  cancelButtonHover: {
    background: "linear-gradient(90deg, #4b5563, #374151)",
    transform: "scale(1.05)",
  },
};

export default EditProfile;
