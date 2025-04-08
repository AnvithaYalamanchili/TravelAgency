import React, { useState, useEffect } from "react";
import './LandingPage.css';

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

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000); // Switch the image every 5 seconds
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <nav className="navbar">
        <img
          style={{ height: '120px', backgroundColor: "transparent", marginTop: "-20px" }}
          src="./logo.png"
          alt="logo"
        />
        <ul className="navbar-links">
          <li><a href="/admin-login">Admin Login</a></li>
          <li className="dropdown">
            <button className="dropbtnss">Join Us ▼</button>
            <div className="dropdown-content">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </li>
        </ul>
      </nav>

      <div className="container1">
        <div className="books">
  {images.map((img, index) => (
    <div
      key={index}
      className={`bg-slide ${index === currentImageIndex ? "active" : ""}`}
      style={{ backgroundImage: `url(${img})` ,backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',}}
    ></div>
  ))}
  <div className="amazing">
    <h1>Make Your Tour Amazing With Us</h1>
    <p>Travel to any corner of the world without going in circles</p>
    <button>Book Now</button>
  </div>
</div>
        <div className="search-sections">
          <h2>It's time to start your adventure</h2>
          <p>Find your perfect travel destination</p>

          <div className="search-forms">
            <input className="destination" type="text" placeholder="Destination" />
            <input type="number" placeholder="$ Price Limit" />
            
          </div>
          <button className="searchs">Search</button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
