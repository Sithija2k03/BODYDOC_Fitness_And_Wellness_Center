import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6

const Home = () => {
    const navigate = useNavigate(); // Create navigate function for routing

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev); 
    };

    const handleSignUpClick = () => {
        navigate("/register"); // Navigate to the Register page
    };

    const handleLoginClick = () => {
        navigate("/login"); // Navigate to the Register page
    };

    
    const handleBookingClick = () => {
        navigate("/booking"); // Navigate to the Booking page
    };


    const styles = {
        navbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 50px",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            position: "fixed",
            width: "100%",
            top: 0,
            zIndex: 1000,
        },
        logo: {
            width: "100px",
        },
        navLinks: {
            listStyle: "none",
            display: "flex",
            gap: "20px",
            marginRight: "80px",
        },
        navLink: {
            color: "black",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "22px",
            cursor: "pointer", // Add pointer cursor for better UX
        },
        dropdown: {
            position: "relative",
        },
        dropdownMenu: {
            display: isDropdownOpen ? "block" : "none",
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 1000,
        },
        dropdownItem: {
            color: "black",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
            padding: "10px 0",
            display: "block",
        },
        authButton: {
            backgroundColor: "#F56692",
            color: "white",
            border: "none",
            borderRadius: "18px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s ease-in-out",
        },
        hero: {
            marginTop: "130px",
            textAlign: "center",
            padding: "70px",
            color: "white",
            position: "relative",
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        heroImage: {
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
            transition: "opacity 1s ease-in-out",
        },
        heroContent: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        },
        heroTitle: {
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "20px",
            letterSpacing: "2px",
        },
        heroDescription: {
            fontSize: "1.5rem",
            lineHeight: "1.8",
            marginBottom: "30px",
            maxWidth: "80%",
            margin: "0 auto",
        },
        contactBtn: {
            padding: "15px 30px",
            marginTop: "60px",
            backgroundColor: "#F56692",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease-in-out",
            fontSize: "1.2rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
        },
        blackSection: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "black",
            color: "white",
            padding: "60px 50px",
            marginTop: "100px",
        },
        blackSectionText: {
            flex: 1,
            fontSize: "1.5rem",
            lineHeight: "1.8",
            marginRight: "30px",
        },
        blackSectionImage: {
            flex: 1,
            width: "40px",
            height: "auto",
            borderRadius: "8px",
        },
        videoSection: {
            marginTop: "100px",
            display: "flex",
            justifyContent: "center",
            padding: "20px",
        },
        video: {
            width: "80%",
            height: "auto",
            borderRadius: "10px",
        },
        whiteSection: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            padding: "60px 50px",
            marginTop: "100px",
        },
        circleImage: {
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            objectFit: "cover",
        },
        whiteSectionText: {
            flex: 1,
            fontSize: "1.5rem",
            lineHeight: "1.8",
            marginLeft: "30px",
        },
        footer: {
            backgroundColor: "black",
            color: "white",
            padding: "40px 50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "100px",
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
        },
        whatsappIcon: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
        }
    };

    // Slideshow Images
    const images = [
        "/img/slide_image1.jpg",
        "/img/slide_image2.jpg",
        "/img/slide_image3.jpg",
        "/img/slide_image4.jpg",
        "/img/slide_image5.jpg"
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Navbar Section */}
            <nav style={styles.navbar}>
            <img src="/img/bodydoc.png" alt="Body Doc Logo" style={styles.logo} />
            <ul style={styles.navLinks}>
                <li><a href="/" style={styles.navLink}>Home</a></li>
                <li style={styles.dropdown}>
                    <a href="#" onClick={handleDropdownToggle} style={styles.navLink}>
                        Facilities & Services
                    </a>
                    <div style={styles.dropdownMenu}>
                        <a href="/gym" style={styles.dropdownItem}>Gym</a>
                        <a href="/swimming-pool" style={styles.dropdownItem}>Swimming Pool</a>
                        <a href="/pool-lounge" style={styles.dropdownItem}>Pool Lounge</a>
                        <a href="/medicare" style={styles.dropdownItem}>Medicare & Clinic</a>
                        <a href="/pharmacy" style={styles.dropdownItem}>Pharmacy</a>
                    </div>
                </li>
                <li><a href="/Membership" style={styles.navLink}>Membership</a></li>
                <li><a href="/booking" style={styles.navLink}>Online Booking</a></li>
                <li><a href="/About" style={styles.navLink}>About Us</a></li>
                <li><a href="/Contact" style={styles.navLink}>Contact Us</a></li>
                
                <li><button style={styles.authButton} onClick={() => window.location.href = "../Register"}>Sign Up</button></li>
                <li><button style={styles.authButton} onClick={() => window.location.href = "../Login"}>Log In</button></li>
            </ul>
        </nav>

            {/* Hero Section */}
            <header style={styles.hero}>
                <img src={images[currentImage]} alt="Gym" style={styles.heroImage} />
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Join Our Fitness Community</h1>
                    <p style={styles.heroDescription}>
                        Ready to embark on your fitness journey? Visit our gym today <br /> 
                        and experience the difference firsthand. Our friendly staff is here <br /> 
                        to answer your questions and help you get started on the path to a <br /> 
                        healthier, happier you.
                    </p>
                    <button style={styles.contactBtn} onClick={() => window.location.href = "/signup"}>Sign Up Now</button>
                </div>
            </header>

            {/* Black Section */}
            <section style={styles.blackSection}>
                <div style={styles.blackSectionText}>
                    <h2>Luxurious Facilities for Unparalleled Fitness and Relaxation</h2>
                    <p>
                        We are located on Athurugiriya Road, less than 1 km from the heart of Malabe town.
                        Designed by an award winning architect, this spacious state of the art facility boasts
                        over 50,000 square feet in size, making it truly world class. Hence, this building is not 
                        only the largest but could also be defined as the epitome of luxury fitness and wellness centers in Sri Lanka!
                    </p>
                </div>
                <img src="/img/black_section2.jpg" alt="Fitness" style={styles.blackSectionImage} />
            </section>

            {/* Video Section */}
            <section style={styles.videoSection}>
                <video style={styles.video} controls>
                    <source src="/videos/Walkthrough.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </section>

            {/* White Section */}
            <section style={styles.whiteSection}>
                <img src="/img/white_section.jpg" alt="Circle" style={styles.circleImage} />
                <div style={styles.whiteSectionText}>
                    <h2>Experience the Best of Fitness</h2>
                    <p>
                        At BodyDoc, we provide world-class facilities, expert trainers, and top-notch services to help you achieve your fitness goals. 
                        Whether you're looking for a challenging workout, relaxing spa treatments, or personalized fitness plans, we have it all.
                    </p>
                    <button style={styles.authButton} onClick={() => window.location.href = "/about"}>Read More...</button>
                </div>
            </section>

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

    </div>

   
     );
};

export default Home;
