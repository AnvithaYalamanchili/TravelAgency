import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
// Array of Background Images
const images = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg",
  "/bg4.jpg",
  "/bg5.jpg",
  "/bg6.jpg"
];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);

  // Change background image every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  // Next Image Function
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Previous Image Function
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      {/* Top Menu Bar */}
      <nav className="top-menu">
        {/* Logo on the left */}
        <div className="logo">
          <img src="./logo.png" alt="Logo" />
        </div>

        {/* Menu items on the right */}
        <div className="menu-items">
          {/* About Us Button */}
          <button
            className="about-btn"
            onClick={() => setAboutUsVisible(!aboutUsVisible)}
          >
            About Us
          </button>

          <Link to="/admin-login" className="admin-btn">
            Admin Login
          </Link>

          {/* Dropdown for Login & Register */}
          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Join Us ▾
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/login" className="dropdown-item">
                  Login
                </Link>
                <Link to="/register" className="dropdown-item">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Background Navigation Buttons */}
      <button className="left-btn" onClick={prevImage}>←</button>
      <button className="right-btn" onClick={nextImage}>→</button>

      {/* About Us Section (Appears on Click) */}
      {aboutUsVisible && (
        <div className="about-us">
          <h2>About Us</h2>
          <p>We are a passionate travel agency dedicated to making your journeys unforgettable.</p>
          <div className="about-images">
            <img src="images/about1.jpg" alt="Travel" />
            <img src="images/about2.jpg" alt="Adventures" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="landing-content">
        <h1>Welcome to Voyagers</h1>
        <Link to="/register" className="btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
