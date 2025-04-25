import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import './LandingPage.css';

const images = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg",
  "/bg4.jpg",
  "/bg5.jpg",
  "/bg6.jpg"
];

const packages = [
  {
    id: 1,
    title: "European Explorer",
    description: "Discover the charm of Europe's most iconic cities",
    price: 2499,
    duration: "14 days",
    rating: 4.8,
    image: "/eurpoe.jpg"
  },
  {
    id: 2,
    title: "Tropical Paradise",
    description: "Relax on pristine beaches with crystal clear waters",
    price: 1899,
    duration: "7 days",
    rating: 4.9,
    image: "/tropical.jpg"
  },
  {
    id: 3,
    title: "Cultural Asia",
    description: "Immerse yourself in ancient traditions and modern wonders",
    price: 2999,
    duration: "21 days",
    rating: 4.7,
    image: "/asia.jpg"
  },
  {
    id: 4,
    title: "African Safari",
    description: "Witness majestic wildlife in their natural habitat",
    price: 3499,
    duration: "10 days",
    rating: 4.9,
    image: "/africa.jpg"
  }
];

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    comment: "The European tour was absolutely breathtaking! Every detail was perfectly arranged.",
    rating: 5,
    location: "New York, USA"
  },
  {
    id: 2,
    name: "Michael Chen",
    comment: "Best vacation ever! The guides were knowledgeable and the itinerary was well-paced.",
    rating: 5,
    location: "Toronto, Canada"
  },
  {
    id: 3,
    name: "Emma Williams",
    comment: "The tropical getaway was exactly what we needed. Beautiful resorts and amazing food!",
    rating: 4,
    location: "London, UK"
  },
  {
    id: 4,
    name: "David Rodriguez",
    comment: "The safari experience was unforgettable. Saw the Big Five within the first two days!",
    rating: 5,
    location: "Madrid, Spain"
  }
];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    destination: "",
    price: ""
  });

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
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

      <div className="hero-container">
        <div className="hero-slider">
          {images.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>HELLO! Let's Travel Together</h1>
            <button className="cta-button">Explore Destinations</button>
          </div>
          <button className="slider-nav prev" onClick={prevImage}>
            <FaArrowLeft />
          </button>
          <button className="slider-nav next" onClick={nextImage}>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-box">
            <h2>Find Your Perfect Trip</h2>
            <form onSubmit={handleSearch}>
              <div className="search-form">
                <div className="form-group">
                  <FaMapMarkerAlt className="input-icon" />
                  <input 
                    type="text" 
                    name="destination" 
                    placeholder="Where to?" 
                    value={searchQuery.destination}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <FaCalendarAlt className="input-icon" />
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="Max budget ($)" 
                    value={searchQuery.price}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="search-button">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="packages-section">
        <div className="section-header">
          <h2>Featured Travel Packages</h2>
          <p>Curated experiences for every type of traveler</p>
        </div>
        <div className="packages-grid">
          {packages.map(pkg => (
            <div key={pkg.id} className="package-card">
              <div className="package-image" style={{ backgroundImage: `url(${pkg.image})` }}>
                <div className="price-tag">${pkg.price}</div>
              </div>
              <div className="package-content">
                <div className="package-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(pkg.rating) ? "star-filled" : "star-empty"} />
                  ))}
                  <span>{pkg.rating}</span>
                </div>
                <h3>{pkg.title}</h3>
                <p>{pkg.description}</p>
                <div className="package-meta">
                  <span><FaCalendarAlt /> {pkg.duration}</span>
                </div>
                <button className="package-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <div className="section-header">
          <h2>What Our Travelers Say</h2>
          <p>Hear from our satisfied customers</p>
        </div>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">
                  <FaUser />
                </div>
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <p>{review.location}</p>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? "star-filled" : "star-empty"} />
                ))}
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LandingPage;