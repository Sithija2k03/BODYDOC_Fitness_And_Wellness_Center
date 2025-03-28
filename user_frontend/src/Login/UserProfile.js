import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 

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

        let userData = response.data;
        
        // Assign default profile picture based on gender if no image is provided
        if (!userData.profilePic) {
          userData.profilePic = userData.gender === "female"
            ? "/images/female-default.png"
            : "/images/male-default.png";
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login"); // Redirect to login if not authenticated
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8070/user/delete/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear(); 
        navigate("/register");
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Header activeTab="profile" />
      <div style={styles.profileContainer}>
        <div style={styles.profileHeader}>
          <div style={{ 
            ...styles.profileIcon, 
            backgroundImage: `url(${user.profilePic})` 
          }} />
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

// Internal CSS

const styles = {
  profileContainer: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "40px",
    background: "linear-gradient(145deg, #B3E5FC, #FFEBEE)", // Light blue and pink gradient
    borderRadius: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.1)", // Subtle shadow
    textAlign: "center",
    color: "#333", // Dark gray text for better contrast and readability
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
    backgroundColor: "#f0f0f0", // Soft background for the icon
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow for the icon
  },
  profileDetails: {
    fontSize: "18px",
    color: "#333", // Dark gray text for better readability
    marginBottom: "30px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.8)", // Light white background for details
    borderRadius: "15px",
    backdropFilter: "blur(10px)", // Slight blur effect for soft background
  },
  profileActions: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "30px",
  },
  editBtn: {
    padding: "15px 30px",
    backgroundColor: "#4CAF50", // Fresh green color for the edit button
    color: "white",
    borderRadius: "8px",
    cursor: "pointer", // Cursor changes to pointer on hover
  },
  deleteBtn: {
    padding: "15px 30px",
    backgroundColor: "#FF5722", // A vibrant coral red for the delete button
    color: "white",
    borderRadius: "8px",
    cursor: "pointer", // Cursor changes to pointer on hover
  },
};


export default UserProfile;
