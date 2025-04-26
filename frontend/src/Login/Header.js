import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // To track the current route
import "./Header.css"; // Custom CSS
import { Link } from "react-router-dom";

function Header() {
  const [isAiDropdownOpen, setAiDropdownOpen] = useState(false); 
  
  // Get the current route
  const location = useLocation();
  
  // Check if we're on the "User Profile" page (or any other page you'd like to check)
  const isProfilePage = location.pathname === "/user-profile"; // Adjust path as necessary

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src="./img/bodydoc.png" alt="Logo" className="logo-img" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">

          <li><a href="/booking">Online Booking</a></li>
          <li><a href="/appointment-layout">Medicare & Clinic</a></li>
          <li><a href="/addOrder">Pharmacy</a></li>
            <li
                      className="dropdown"
                      onMouseEnter={() => setAiDropdownOpen(true)}
                      onMouseLeave={() => setAiDropdownOpen(false)}
                    >
                      <a href="#">Support with AI ▼</a>
                      {isAiDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li><Link to="/nutrition-plan">Nutrition Plan</Link></li>
                          <li><Link to="/workout-plan">Workout Plan</Link></li>
                          <li><Link to="/BMI">BMI Calculator</Link></li>
                        </ul>
                      )}
                    </li>
        </ul>

       {/* User Profile Icon Linked to /user-profile */}
       <Link to="/user-profile" className={`user-profile ${isProfilePage ? "active" : ""}`}>
          <img src="./img/male-default.png" alt="User Profile" className="profile-icon" />
        </Link>

      </div>
    </nav>
  );
}

export default Header;
