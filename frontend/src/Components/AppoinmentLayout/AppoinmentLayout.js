import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";
import Header from "../../Login/Header";

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const HeroImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
`;

const HeroOverlay = styled.div`
  position: relative;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 40px;
  width: 80%;
  border-radius: 10px;
`;

const Heading = styled.h2`
  color: #f56692;
  font-size: 45px;
  font-weight: bold;
`;

const Paragraph = styled.p`
  font-size: 25px;
  margin-top: 20px;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  width: 80%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AppoinmentLayout = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
      <HeroSection>
        <HeroImage
          src="https://www.appointy.com/online-booking-software/wp-content/uploads/2020/10/website-mockup-laptop-mobile-tab.png"
          alt="Hero"
        />
        <HeroOverlay>
          <Heading>
            Your Health, Our Priority <br /> Book an Appointment with Expert Care Today!
          </Heading>
          <Paragraph>
            Stay fit and healthy with our expert care and advanced gym management<br />
            system. We provide top-notch fitness facilities and healthcare services<br />
            to help you achieve your wellness goals with ease.
          </Paragraph>
          <Button onClick={() => navigate("/addAppointment")}>Book a Visit</Button>
        </HeroOverlay>
      </HeroSection>
    </>
  );
};

export default AppoinmentLayout;
