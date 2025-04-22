import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./AppoinmentLayout.css";

const AppoinmentLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="https://www.appointy.com/online-booking-software/wp-content/uploads/2020/10/website-mockup-laptop-mobile-tab.png"
          alt="Hero Image"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h2 className="heading">
            Your Health, Our Priority <br /> Book an Appoint
            ment with Expert Care Today!
          </h2>
          <p className="para">
            Stay fit and healthy with our expert care and advanced gym management<br></br>
            system. We provide top-notch fitness facilities and healthcare services<br></br>
            to help you achieve your wellness goals with ease.
          </p>
          <Button className="Button" onClick={() => navigate("/add")}>
            Book a Visit
          </Button>
        </div>
      </div>

    </>
  );
};

export default AppoinmentLayout;
