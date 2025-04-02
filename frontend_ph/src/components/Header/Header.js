import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./Header.css"; // Custom CSS

function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container1">
        {/* Logo */}
        <div className="logo">
          <img src="" alt="Logo" className="logo-img" />
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

          {/* Use Link for Navigation */}
          <li><Link to="/layout">Medicare & Clinic</Link></li>  
          <li><Link to="/order">Pharmacy</Link></li>
          <li><a href="#">Support with AI</a></li>
        </ul>
        
        {/* Search Bar */}
        <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>

        
      </div>
    </nav>
  );
}

export default Header;
