import React from "react";
import styled from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';

const styles = {
  footer: {
      backgroundColor: "black",
      color: "white",
      padding: "40px 50px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: "100px",
      width: "100%",
  },
  footerColumn: {
      flex: 1,
      marginRight: "30px",
  },
  footerTitle: {
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "15px",
      textDecoration: "underline",
  },
  footerText: {
      fontSize: "14px",
      lineHeight: "1.8",
  },
  footerLinks: {
      listStyle: "none",
      padding: 0,
  },
  footerLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "14px",
      display: "block",
      marginBottom: "8px",
  },
  socialIcons: {
      display: "flex",
      gap: "10px",
      marginTop: "15px",
  },
  socialIcon: {
      width: "25px",
      height: "25px",
  },
  copyright: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "14px",
      width:"100%",
  },
  whatsappIcon: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
  }
};


function Footer() {
  return (
    <FooterWrapper>
{/* Footer Section */}
<footer style={styles.footer}>
    <div style={styles.footerColumn}>
        <img src="/img/logo.png" alt="Body Doc Logo" style={{ width: "120px" }} />
        <p style={styles.footerText}>We are Sri Lanka’s first and only medically oriented gym, revolutionizing fitness and wellness.</p>
        <div style={styles.socialIcons}>
            <img src="/img/facebook_logo.png" alt="Facebook" style={styles.socialIcon} />
            <img src="/img/instagram.png" alt="Instagram" style={styles.socialIcon} />
            <img src="/img/whatsapp.png" alt="whatsapp" style={styles.socialIcon} />
        </div>
    </div>
    <div style={styles.footerColumn}>
        <h3 style={styles.footerTitle}>Site Map</h3>
        <ul style={styles.footerLinks}>
            <li><a href="/" style={styles.footerLink}>Home</a></li>
            <li><a href="/about" style={styles.footerLink}>About Us</a></li>
            <li><a href="/contact" style={styles.footerLink}>Contact Us</a></li>
            <li><a href="/services" style={styles.footerLink}>Facilities & Services</a></li>
            <li><a href="/membership" style={styles.footerLink}>Membership</a></li>
        </ul>
    </div>
    <div style={styles.footerColumn}>
        <h3 style={styles.footerTitle}>Contact Info</h3>
        <p style={styles.footerText}>Athurugiriya Road, Malabe, Sri Lanka</p>
        <p style={styles.footerText}>Phone: 071 0XX XXXX</p>
        <p style={styles.footerText}>Email: info@bodydoc.com</p>
    </div>
    </footer>

      {/* Copyright */}
     <div style={styles.copyright}>
      <p>&copy; 2025 Body Doc. All rights reserved.</p>
     </div>
    </FooterWrapper>
  );
}

// Styled Components
const FooterWrapper = styled.footer`
  color: white;
  text-align: center;
  width: "100%";
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
  width: "100%";
`;

export default Footer;
