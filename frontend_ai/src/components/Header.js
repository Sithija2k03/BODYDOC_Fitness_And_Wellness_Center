import React, { useState } from "react";
import "./Header.css"; // Custom CSS

function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="container">
        {/**/}
        <div class="logo">
            <img src="./bodydoc.png" alt="Logo" class="logo-img" />
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
          <li><a href="#">Support with AI</a></li>
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
