import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FiLogOut, FiEdit, FiTrash2 } from "react-icons/fi"; // Added FiEdit and FiTrash2 icons

function UserProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  // State for manage/view bookings section
  const [showBookings, setShowBookings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userData = response.data;
        if (!userData.profilePic) {
          userData.profilePic = userData.gender === "female"
            ? "./img/female-default.png"
            : "./img/male-default.png";
        }
        setUser(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Fetch bookings regardless of tab for the bookings summary
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user?.email) {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:4000/booking/bookings/${user.email}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleEdit = () => navigate("/edit-profile");

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:4000/user/delete/${user._id}`, {
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
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleBookingsView = () => {
    setShowBookings(!showBookings);
  };

  const getStatusCount = (status) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  // Added function to handle booking edit
  const handleBookingEdit = (id) => {
    navigate(`/edit-booking/${id}`);
  };

  // Added function to handle booking delete
  const handleBookingDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:4000/booking/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update bookings list after deletion
        setBookings(bookings.filter((booking) => booking._id !== id));
        alert("Booking deleted successfully!");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Error deleting booking. Please try again.");
      }
    }
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
            <span style={styles.userName}>{user.fullName}</span>
          </div>

          <button style={styles.editBtn} onClick={handleEdit}>Edit Profile</button>
          <button style={styles.deleteBtn} onClick={handleDelete}>Delete Profile</button>

          {/* Bookings Summary Section */}
          <div style={styles.bookingsSummary}>
            <button 
              style={styles.bookingsSummaryToggle} 
              onClick={toggleBookingsView}
            >
              {showBookings ? "Hide Bookings Summary" : "Show Bookings Summary"}
            </button>
            
            {showBookings && (
              <div style={styles.bookingsSummaryContent}>
                <h4 style={styles.bookingSummaryTitle}>My Bookings Summary</h4>
                <div style={styles.bookingCounters}>
                  <div style={styles.counterItem}>
                    <span style={styles.counterLabel}>Total</span>
                    <span style={styles.counterValue}>{bookings.length}</span>
                  </div>
                  <div style={styles.counterItem}>
                    <span style={styles.counterLabel}>Pending</span>
                    <span style={{...styles.counterValue, color: "#FFC107"}}>{getStatusCount("Pending")}</span>
                  </div>
                  <div style={styles.counterItem}>
                    <span style={styles.counterLabel}>Approved</span>
                    <span style={{...styles.counterValue, color: "#4CAF50"}}>{getStatusCount("Approved")}</span>
                  </div>
                  <div style={styles.counterItem}>
                    <span style={styles.counterLabel}>Declined</span>
                    <span style={{...styles.counterValue, color: "#FF5722"}}>{getStatusCount("Declined")}</span>
                  </div>
                </div>
                
                {bookings.length > 0 && (
                  <div style={styles.recentBooking}>
                    <h5 style={styles.recentBookingTitle}>Latest Booking</h5>
                    <div style={styles.recentBookingItem}>
                      <p><strong>Facility:</strong> {bookings[0].facility_type}</p>
                      <p><strong>Date:</strong> {new Date(bookings[0].date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span style={{
                        color: bookings[0].status === "Approved" ? "#4CAF50" : 
                              bookings[0].status === "Declined" ? "#FF5722" : "#FFC107",
                        fontWeight: "bold"
                      }}>{bookings[0].status}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={styles.navLinks}>
            <button 
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === "profile" ? "#e0e0e0" : "#f4f4f4"
              }}
              onClick={() => handleNavClick("profile")}
            >
              Profile Information
            </button>
            <button 
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === "bookings" ? "#e0e0e0" : "#f4f4f4"
              }}
              onClick={() => handleNavClick("bookings")}
            >
              My Bookings
            </button>
            <button 
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === "appointments" ? "#e0e0e0" : "#f4f4f4"
              }}
              onClick={() => handleNavClick("appointments")}
            >
              My Doc Appointments
            </button>
            <button 
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === "orders" ? "#e0e0e0" : "#f4f4f4"
              }}
              onClick={() => handleNavClick("orders")}
            >
              My Orders
            </button>
          </div>

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
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          )}
          {activeTab === "bookings" && (
            <div>
              <h3>My Bookings</h3>
              {bookings.length > 0 ? (
                <ul style={styles.bookingsList}>
                  {bookings.map((booking) => (
                    <li key={booking._id} style={styles.bookingItem}>
                      <strong>Facility:</strong> {booking.facility_type} <br />
                      <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} <br />
                      <strong>Time Slot:</strong> {booking.time_slot} <br />
                      <strong>Status:</strong> <span style={{
                        color: booking.status === "Approved" ? "#4CAF50" : 
                               booking.status === "Declined" ? "#FF5722" : "#FFC107",
                        fontWeight: "bold"
                      }}>{booking.status}</span>
                      
                      {/* Added action buttons */}
                      <div style={styles.bookingActions}>
                        <button 
                          style={styles.editBookingBtn} 
                          onClick={() => handleBookingEdit(booking._id)}
                        >
                          <FiEdit size={16} /> Edit
                        </button>
                        <button 
                          style={styles.deleteBookingBtn} 
                          onClick={() => handleBookingDelete(booking._id)}
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>
                      </div>
                      <hr />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          )}
          {activeTab === "appointments" && (
            <div>
              <h3>My Doc Appointments</h3>
              <p>No appointments found.</p> {/* Placeholder text */}
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h3>My Orders</h3>
              <p>No orders found.</p> {/* Placeholder text */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", width: "100%" },
  profileContainer: {
    display: "flex", flexDirection: "row", width: "90%",
    marginTop: "100px", marginLeft: "75px"
  },
  sideNav: {
    width: "300px", background: "#fff", padding: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.1)", borderRadius: "10px",
    marginRight: "20px", display: "flex", flexDirection: "column"
  },
  profileHeader: {
    display: "flex", alignItems: "center", gap: "15px",
    marginBottom: "20px"
  },
  profileIcon: {
    width: "80px", height: "80px", borderRadius: "50%",
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundColor: "#f0f0f0",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
  },
  userName: { fontSize: "18px", fontWeight: "500", color: "#333" },
  editBtn: {
    padding: "12px 20px", backgroundColor: "#4CAF50", color: "white",
    borderRadius: "8px", cursor: "pointer", marginBottom: "15px",
    fontSize: "16px", fontWeight: "500", textAlign: "center",
    border: "none", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease"
  },
  deleteBtn: {
    padding: "12px 20px", backgroundColor: "#FF5722", color: "white",
    borderRadius: "8px", cursor: "pointer", marginBottom: "20px",
    fontSize: "16px", fontWeight: "500",
    textAlign: "center", border: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease"
  },
  bookingsSummary: {
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)"
  },
  bookingsSummaryToggle: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    width: "100%",
    textAlign: "center",
    marginBottom: showBookings => showBookings ? "15px" : "0"
  },
  bookingsSummaryContent: {
    marginTop: "15px"
  },
  bookingSummaryTitle: {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "10px",
    color: "#333",
    textAlign: "center"
  },
  bookingCounters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "15px"
  },
  counterItem: {
    flex: "1 0 45%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "6px",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)"
  },
  counterLabel: {
    fontSize: "12px",
    color: "#666"
  },
  counterValue: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333"
  },
  recentBooking: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "6px",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)"
  },
  recentBookingTitle: {
    fontSize: "14px",
    marginBottom: "8px",
    color: "#333",
    textAlign: "center"
  },
  recentBookingItem: {
    fontSize: "13px"
  },
  navLinks: {
    display: "flex", flexDirection: "column", gap: "10px",
    marginBottom: "20px"
  },
  navBtn: {
    padding: "10px", border: "none",
    borderRadius: "8px", cursor: "pointer", fontSize: "16px",
    textAlign: "left", width: "100%", transition: "background-color 0.3s"
  },
  logoutBtn: {
    padding: "10px", backgroundColor: "#FF5722", color: "white",
    borderRadius: "50%", cursor: "pointer", border: "none",
    marginTop: "auto", transition: "all 0.3s ease",
    alignSelf: "center"
  },
  profileContent: {
    flex: 1, padding: "20px",
    background: "linear-gradient(145deg, #B3E5FC, #FFEBEE)",
    borderRadius: "20px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.1)", textAlign: "left"
  },
  profileDetails: {
    fontSize: "18px", color: "#333", marginBottom: "30px"
  },
  bookingsList: {
    listStyleType: "none",
    padding: 0
  },
  bookingItem: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
  },
  // Added styles for booking action buttons
  bookingActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },
  editBookingBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },
  deleteBookingBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }
};

export default UserProfile;