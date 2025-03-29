import React, { useState, useEffect } from "react";

const Membership = () => {

     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
        const handleDropdownToggle = () => {
            setIsDropdownOpen((prev) => !prev); 
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
        container: {
            maxWidth: "1200px",
            margin: "0 auto",
            marginTop: "100px",
            padding: "50px 20px",
            textAlign: "center",
        },
        title: {
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        description: {
            fontSize: "1.2rem",
            marginBottom: "40px",
            color: "#555",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
        },
        card: {
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
        },
        cardTitle: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        price: {
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#27ae60",
            marginBottom: "15px",
        },
        list: {
            paddingLeft: "20px",
        },
        listItem: {
            marginBottom: "10px",
        },
    };

    const packages = [
        { title: "Gym Only Gents", price: "88,500", details: ["Full access to gym", "Locker room access", "Free fitness assessment"] },
        { title: "Gym Only Ladies", price: "79,500", details: ["Full access to gym", "Locker room access", "Women-only sessions"] },
        { title: "Pool Only Gents", price: "66,000", details: ["Access to swimming pool", "Changing rooms included", "Lifeguard assistance"] },
        { title: "Gym & Pool Gents", price: "120,000", details: ["Full gym & pool access", "Sauna included", "Locker room access"] },
        { title: "Gym & Pool Couple", price: "200,000", details: ["Full gym & pool access for two", "Exclusive couple sessions", "Locker room access"] },
        { title: "Gym Only Student", price: "56,000", details: ["Student discount", "Gym access during non-peak hours", "Locker room access"] },
        { title: "Pool Only Student", price: "45,000", details: ["Discounted pool access", "Lifeguard assistance", "Changing rooms included"] },
        { title: "Gym & Pool Student", price: "77,000", details: ["Full access to both facilities", "Discounted student rate", "Sauna included"] },
        { title: "Gym Only Individual (1 Month)", price: "25,000", details: ["1-month gym access", "Locker room included", "Free fitness assessment"] },
        { title: "Pool Only Individual (1 Month)", price: "14,000", details: ["1-month pool access", "Lifeguard assistance", "Changing rooms included"] },
        { title: "Gym & Pool Individual (1 Month)", price: "30,000", details: ["1-month access to both", "Locker room included", "Sauna access"] },
        { title: "Corporate Membership", price: "Contact Us", details: ["Special corporate discounts", "Group packages available", "Custom fitness plans"] },
    ];

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
            
            <li><button style={styles.authButton} onClick={() => window.location.href = "/signup"}>Sign Up</button></li>
            <li><button style={styles.authButton} onClick={() => window.location.href = "/login"}>Log In</button></li>
        </ul>
    </nav>
        <div style={styles.container}>
            <h1 style={styles.title}>Membership Plans</h1>
            <p style={styles.description}>Choose the best plan that fits your fitness journey.</p>
            <div style={styles.grid}>
                {packages.map((pkg, index) => (
                    <div key={index} style={styles.card}>
                        <h2 style={styles.cardTitle}>{pkg.title}</h2>
                        <p style={styles.price}>LKR {pkg.price}</p>
                        <ul style={styles.list}>
                            {pkg.details.map((detail, i) => (
                                <li key={i} style={styles.listItem}>{detail}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Membership;
