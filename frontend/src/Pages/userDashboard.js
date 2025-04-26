import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Login/Header";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handleDropdownToggle = () => {
        setIsUserDropdownOpen((prev) => !prev);
    };

    // Handle AI Fitness button click to show modal
    const handleAIFitnessClick = () => {
        setShowModal(true);
    };

    // Handle modal choice
    const handleModalChoice = (route) => {
        setShowModal(false);
        navigate(route);
    };

    // Slideshow Images and Corresponding Buttons with Titles and Descriptions
    const slides = [
        {
            image: '/img/SlideAI.jpg',
            title: "Personalize Your Fitness",
            description: "Create tailored nutrition and workout plans with our AI-powered fitness tools.",
            button: {
                text: "Try AI Fitness",
                action: handleAIFitnessClick,
            },
        },
        {
            image: '/img/SlideGym.jpg',
            title: "Power Up Your Fitness",
            description: "Build strength and endurance with our state-of-the-art gym facilities and expert trainers.",
            button: {
                text: "Book Gym Session",
                action: () => navigate("/booking", { state: { facilityType: "Gym" } }),
            },
        },
        {
            image: '/img/SlideSwim.jpg',
            title: "Dive into Fitness",
            description: "Enjoy a refreshing workout in our luxurious swimming pool, perfect for all fitness levels.",
            button: {
                text: "Book a Swim Session",
                action: () => navigate("/booking", { state: { facilityType: "Swimming Pool" } }),
            },
        },
        {
            image: '/img/SlideB10.jpg',
            title: "Smash Your Goals",
            description: "Challenge yourself on our professional badminton courts, designed for fun and fitness.",
            button: {
                text: "Book Badminton Court",
                action: () => navigate("/booking", { state: { facilityType: "Badminton Court" } }),
            },
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleHeroClick = (e) => {
        e.stopPropagation(); // Prevent clicks from bubbling
    };

    const styles = {
        hero: {
            marginTop: "0px", // Increased to ensure space below fixed header
            textAlign: "center",
            padding: "70px",
            color: "white",
            position: "relative",
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            zIndex: 0, // Below header
        },
        heroImage: {
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
            opacity: 1,
            transition: "opacity 1s ease-in-out",
        },
        heroImageHidden: {
            opacity: 0,
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
        heroContentInner: {
            transition: "opacity 0.5s ease-in-out",
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
        slideButton: {
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
        modal: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 1002, // Above header
            textAlign: "center",
        },
        modalButton: {
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#F56692",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
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
    };

    return (
        <div>
            {/* Header Section */}
            <Header />

            {/* Hero Section */}
            <header style={styles.hero} onClick={handleHeroClick}>
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        style={{
                            ...styles.heroImage,
                            ...(index === currentImage ? {} : styles.heroImageHidden),
                        }}
                    />
                ))}
                <div style={styles.heroContent} aria-live="polite">
                    <div style={styles.heroContentInner}>
                        <h1 style={styles.heroTitle}>{slides[currentImage].title}</h1>
                        <p style={styles.heroDescription}>{slides[currentImage].description}</p>
                    </div>
                    <button
                        style={styles.slideButton}
                        onClick={slides[currentImage].button.action}
                        aria-label={slides[currentImage].button.text}
                    >
                        {slides[currentImage].button.text}
                    </button>
                </div>
            </header>

            {/* Modal for AI Fitness */}
            {showModal && (
                <div style={styles.modal}>
                    <p>Choose a plan:</p>
                    <button
                        onClick={() => handleModalChoice("/nutrition-plan")}
                        style={styles.modalButton}
                        aria-label="Select Nutrition Plan"
                    >
                        Nutrition Plan
                    </button>
                    <button
                        onClick={() => handleModalChoice("/workout-plan")}
                        style={styles.modalButton}
                        aria-label="Select Workout Plan"
                    >
                        Workout Plan
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        style={{ ...styles.modalButton, backgroundColor: "#ccc" }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                </div>
            )}

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
                <p>© 2025 Body Doc. All rights reserved.</p>
            </div>
        </div>
    );
};

export default UserDashboard;