import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

function Header() {
  const [isAiDropdownOpen, setAiDropdownOpen] = useState(false);
  const location = useLocation();
  const isProfilePage = location.pathname === "/user-profile";

  const handleNavigation = () => {
    setAiDropdownOpen(false);
  };

  const styles = `
    .navbar {
      background-color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .logo-img {
      height: 60px;
      width: auto;
      margin-right: 10px;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 20px;
    }
    .nav-links li {
      position: relative;
    }
    .nav-links a {
      text-decoration: none;
      color: #2c3e50;
      font-weight: 500;
      transition: 0.3s;
    }
    .nav-links a:hover {
      color: #F56692;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #f2f2f2;
      list-style: none;
      padding: 10px;
      border-radius: 5px;
      width: 150px;
      display: block;
    }
    .dropdown-menu li {
      padding: 8px 12px;
    }
    .dropdown-menu a {
      color: #2c3e50;
      text-decoration: none;
      display: block;
      transition: background 0.3s, color 0.3s;
    }
    .dropdown-menu a:hover {
      background-color: #F56692;
      color: white !important;
    }
    .user-profile {
      margin-left: auto;
      cursor: pointer;
      position: relative;
    }
    .user-profile img {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      transition: 0.3s ease;
    }
    .user-profile.active img {
      border: 2px solid #F56692;
    }
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        align-items: flex-start;
      }
      .nav-links {
        flex-direction: column;
        gap: 10px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar" style={{ zIndex: 1000, position: "fixed", top: 0, left: 0, right: 0 }}>
        <div className="container">
          <Link to="/" className="logo">
            <img
              src="/img/bodydoc.png"
              alt="Body Doc Logo"
              className="logo-img"
              onError={(e) => (e.target.src = "/img/fallback-logo.png")}
            />
          </Link>
          <ul className="nav-links">
            <li><a href="/booking">Online Booking</a></li>
            <li><a href="/appointment-layout">Medicare & Clinic</a></li>
            <li><a href="/addOrder">Pharmacy</a></li>
            <li
              className="dropdown"
              onMouseEnter={() => setAiDropdownOpen(true)}
              onMouseLeave={() => setAiDropdownOpen(false)}
            >
              <button
                className="dropdown-toggle"
                aria-expanded={isAiDropdownOpen}
                style={{ background: "none", border: "none", color: "#2c3e50", cursor: "pointer", fontSize: "16px" }}
              >
                Support with AI ▼
              </button>
              {isAiDropdownOpen && (
                <ul className="dropdown-menu" style={{ zIndex: 1001 }}>
                  <li>
                    <Link to="/nutrition-plan" onClick={handleNavigation} aria-label="Navigate to Nutrition Plan">
                      Nutrition Plan
                    </Link>
                  </li>
                  <li>
                    <Link to="/workout-plan" onClick={handleNavigation} aria-label="Navigate to Workout Plan">
                      Workout Plan
                    </Link>
                  </li>
                  <li>
                    <Link to="/BMI" onClick={handleNavigation} aria-label="Navigate to BMI Calculator">
                      BMI Calculator
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <Link to="/user-profile" className={`user-profile ${isProfilePage ? "active" : ""}`}>
            <img
              src="/img/male-default.png"
              alt="User Profile"
              className="profile-icon"
              onError={(e) => (e.target.src = "/img/fallback-profile.png")}
            />
          </Link>
        </div>
      </nav>
      <div style={{ height: "90px" }}></div>
    </>
  );
}

export default Header;