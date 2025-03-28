import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Membership from "./Pages/Membership";
import Register from "./Register/Register";  // Import Register component
import Login from './Login/Login';
import UserProfile from "./Login/UserProfile";
import EditProfile from "./Login/EditProfile";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/register" element={<Register />} /> 
                <Route path="/login" element={<Login />} /> 
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />

            </Routes>
        </Router>
    );
};

export default App;
