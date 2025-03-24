import React, { useState } from "react";
import "./Header.css"; // Custom CSS
import { Link } from "react-router-dom";

function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAiDropdownOpen, setAiDropdownOpen] = useState(false); // State for AI dropdown

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src="./bodydoc.png" alt="Logo" className="logo-img" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <a href="#">Recreational Activities ▼</a>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="#">Yoga</a></li>
                <li><a href="#">Badminton</a></li>
                <li><a href="#">Swimming</a></li>
                <li><a href="#">Pool Lounge</a></li>
              </ul>
            )}
          </li>
          <li><a href="#">Medicare & Clinic</a></li>
          <li><a href="#">Pharmacy</a></li>
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
              </ul>
            )}
          </li>
        </ul>

        {/* Search Form */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
    </nav>
  );
}

export default Header;