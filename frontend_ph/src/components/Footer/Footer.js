import React from "react";
import styled from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';


function Footer() {
  return (
    <FooterWrapper>
      {/* Footer Content */}
      <FooterContent>
        <AboutSection>
        <div class="logo">
        <img src="./bodydoc.png" alt="Logo" className="logo-img" />

        </div>
          <Logo>BODY <span>DOC</span></Logo>
          <p>
            We are Sri Lanka’s first and only medically oriented gym,
            revolutionizing fitness and wellness.
          </p>
          <SocialIcons>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </SocialIcons>
        </AboutSection>

        <FooterSection>
          <SectionTitle>Site Map</SectionTitle>
          <FooterLink href="#">Home</FooterLink>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Gym System Login</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Facilities & Services</SectionTitle>
          <FooterLink href="#">Recreational Activities</FooterLink>
          <FooterLink href="#">Medicare & Clinic</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Train at Body Doc</SectionTitle>
          <FooterLink href="#">Personal Training</FooterLink>
          <FooterLink href="#">Group Fitness</FooterLink>
          <FooterLink href="#">Class Schedule</FooterLink>
        </FooterSection>
      </FooterContent>

      {/* Copyright Section */}
      <Copyright>
        <p>© Copyright 2023 BodyDoc. Developed by <strong>GCM</strong></p>
      </Copyright>
    </FooterWrapper>
  );
}

// Styled Components
const FooterWrapper = styled.footer`
  background-color:#2c3e50;
  color: white;
  text-align: center;
`;



const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 40px 0;
`;

const AboutSection = styled.div`
  max-width: 300px;
  text-align: left;
`;

const Logo = styled.h2`
  color: #00cc66;
  font-weight: bold;
  span {
    color: white;
  }
`;

const SocialIcons = styled.div`
  margin-top: 10px;
  a {
    color: white;
    font-size: 20px;
    margin-right: 10px;
  }
`;

const FooterSection = styled.div`
  text-align: left;
  min-width: 200px;
`;

const SectionTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 5px;
  &:hover {
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  padding: 15px;
  border-top: 1px solid #444;
  font-size: 14px;
`;

export default Footer;
