import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 
import { FiLogOut } from "react-icons/fi"; // Import logout icon from react-icons

function UserProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
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
            ? "./img/female-default.png"
            : "./img/male-default.png";
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

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <Header activeTab="profile" />
      <div style={styles.profileContainer}>
        <div style={styles.sideNav}>
          <div style={styles.profileHeader}>
            <div 
              style={{ 
                ...styles.profileIcon, 
                backgroundImage: `url(${user.profilePic})` 
              }} 
            />
            <span style={styles.userName}>{user.fullName}</span> {/* Display user's name */}
          </div>
          <button style={styles.editBtn} onClick={handleEdit}>Edit Profile</button>
          <button style={styles.deleteBtn} onClick={handleDelete}>Delete Profile</button>

          <div style={styles.navLinks}>
            <button style={styles.navBtn} onClick={() => handleNavClick("profile")}>Profile Information</button>
            <button style={styles.navBtn} onClick={() => handleNavClick("bookings")}>My Bookings</button>
            <button style={styles.navBtn} onClick={() => handleNavClick("appointments")}>My Doc Appointments</button>
            <button style={styles.navBtn} onClick={() => handleNavClick("orders")}>My Orders</button>
          </div>

          {/* Logout Icon Button */}
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={24} color="white" />
          </button>
        </div>

        <div style={styles.profileContent}>
          {activeTab === "profile" && (
            <div style={styles.profileDetails}>
              <h3>Profile Information</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Membership Status:</strong> {user.membershipStatus}</p>
            </div>
          )}
          {activeTab === "bookings" && (
            <div>
              <h3>My Bookings</h3>
              {/* Add content for bookings here */}
            </div>
          )}
          {activeTab === "appointments" && (
            <div>
              <h3>My Doc Appointments</h3>
              {/* Add content for appointments here */}
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h3>My Orders</h3>
              {/* Add content for orders here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal CSS

const styles = {
  container: {
    display: "flex",
    flexDirection: "column", // Ensure the header is positioned on top of everything
    width: "100%", 
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginTop: "100px",
    marginLeft: "75px",
  },
  sideNav: {
    width: "300px",
    background: "#fff",
    padding: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    marginRight: "20px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  profileIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#f0f0f0",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  userName: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
  },
  editBtn: {
    padding: "12px 20px",
    backgroundColor: "#4CAF50", // Fresh green
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    border: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    transition: "all 0.3s ease", // Smooth transition for hover effect
  },
  deleteBtn: {
    padding: "12px 20px",
    backgroundColor: "#FF5722", // Rich, vibrant red
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "25px",
    marginLeft: "25px",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    border: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    transition: "all 0.3s ease", // Smooth transition for hover effect
  },
  navLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  navBtn: {
    padding: "10px",
    backgroundColor: "#f4f4f4",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "left",
    width: "100%",
    transition: "background-color 0.3s",
  },
  logoutBtn: {
    padding: "10px",
    backgroundColor: "#FF5722", // Red background for logout icon
    color: "white",
    borderRadius: "50%",
    cursor: "pointer",
    border: "none",
    marginTop: "30px",
    transition: "all 0.3s ease",
  },
  profileContent: {
    flex: 1,
    padding: "20px",
    background: "linear-gradient(145deg, #B3E5FC, #FFEBEE)",
    borderRadius: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  profileDetails: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "30px",
  },
};

export default UserProfile;
