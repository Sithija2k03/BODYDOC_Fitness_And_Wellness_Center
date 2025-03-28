import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 
import { FaUserCircle } from "react-icons/fa"; // Profile icon

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.get("http://localhost:8070/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login"); // Redirect to login if not authenticated
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Get the default profile picture based on gender
  const getProfilePic = () => {
    if (user && user.profilePic) return user.profilePic;
    return user && user.gender === "female"
      ? "/images/female-default.png" // Default female image
      : "/images/male-default.png";   // Default male image
  };

  // Handle Edit Profile (navigate to edit page)
  const handleEdit = () => {
    navigate("/edit-profile");
  };

  // Handle Delete Profile
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8070/user/delete/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear(); // Clear user data
        navigate("/register"); // Redirect after deletion
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Header activeTab="profile" /> {/* Header with active profile tab */}
      <div style={styles.profileContainer}>
        <div style={styles.profileHeader}>
          {/* Auto-filled FaUserCircle with Profile Picture */}
          <div style={{ ...styles.profileIcon, backgroundImage: `url(${getProfilePic()})` }} />
          <h2>{user.fullName}'s Profile</h2>
        </div>
        <div style={styles.profileDetails}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Membership Status:</strong> {user.membershipStatus}</p>
        </div>
        <div style={styles.profileActions}>
          <button style={styles.editBtn} onClick={handleEdit}>Edit Profile</button>
          <button style={styles.deleteBtn} onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>
    </div>
  );
}

// Inline CSS styles
const styles = {
  profileContainer: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "40px",
    background: "linear-gradient(145deg, #FF6F61, #FF9A9E)", // Soft gradient
    borderRadius: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.15)", // Soft shadow
    textAlign: "center",
    color: "#fff",
    position: "relative",
    transition: "0.5s ease-in-out",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  profileIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#ccc", // Fallback color
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  profileDetails: {
    fontSize: "18px",
    color: "#fff",
    marginBottom: "30px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.6)", // Glassmorphism
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },
  profileActions: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "30px",
  },
  editBtn: {
    padding: "15px 30px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#4CAF50", // Fresh Green
    color: "white",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "0.3s ease-in-out",
  },
  deleteBtn: {
    padding: "15px 30px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#F44336", // Red
    color: "white",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "0.3s ease-in-out",
  },
};

export default UserProfile;
