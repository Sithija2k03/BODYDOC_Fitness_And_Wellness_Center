import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function EditProfile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    profilePic: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8070/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userData = response.data;

        // Assign default profile picture if not provided
        if (!userData.profilePic) {
          userData.profilePic = userData.gender === "female"
            ? "/images/female-default.png"
            : "/images/male-default.png";
        }

        setFormData(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8070/user/update/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      navigate("/user-profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Header activeTab="profile" />
      <div style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        background: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}>
        <h2 style={{ marginBottom: "20px" }}>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone:</label>
          <input type="phone" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit" style={buttonStyle}>Save Changes</button>
          <button type="button" onClick={() => navigate("/profile")} style={{ ...buttonStyle, backgroundColor: "#dc3545" }}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
};

export default EditProfile;