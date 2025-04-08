import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Swiper modules={[Navigation, Autoplay]} navigation autoplay={{ delay: 3000 }}>
        <SwiperSlide>
          <img src="./travellers2.jpg" alt="Travel adventure" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="./beach.jpg" alt="Adventure" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="./scenary.jpg" alt="Scenic view" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export const TripCard = ({ title, image, onLike, isLiked }) => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);

  const handleBookNow = () => {
    window.scrollTo(0, 0);
    navigate(`/trip/${title.toLowerCase().replace(/\s+/g, '')}`);
  };

  const handleHeartClick = (e) => {
    const heartPos = { 
      x: e.nativeEvent.offsetX, 
      y: e.nativeEvent.offsetY 
    };
    setHearts([...hearts, heartPos]);
    onLike();
  };

  return (
    <div className="trip-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <button className="trip-button" onClick={handleBookNow}>Book now</button>

      <span className={`heart ${isLiked ? "liked" : ""}`} onClick={handleHeartClick}>
        {isLiked ? "❤️" : "🤍"}
      </span>

      {hearts.map((heart, index) => (
        <div 
          key={index} 
          className="animated-heart" 
          style={{ left: heart.x - 25, top: heart.y - 25 }} 
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const trips = [
  { title: "New York", image: "./newyork.webp" },
  { title: "Arizona", image: "./arizona.jpg" },
  { title: "Georgia", image: "./georgia.webp" },
];

const internationalTrips = [
  { title: "India", image: "./india.jpg" },
  { title: "Australia", image: "./australia.jpg" },
  { title: "Canada", image: "./canada.jpg" },
];

const HomePage = () => {
  const [likedTrips, setLikedTrips] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve the user ID from localStorage
    const storedUserId = localStorage.getItem("user_id");

    if (storedUserId) {
      setUserId(storedUserId); // Set the user_id
    }

    if (storedUserId) {
      // Retrieve liked trips for the specific user based on their user_id
      const savedLikes = JSON.parse(localStorage.getItem(`${storedUserId}_likedTrips`) || "[]");
      setLikedTrips(savedLikes);
    }
  }, []);

  const handleLike = (title) => {
    const updatedLikes = likedTrips.includes(title)
      ? likedTrips.filter((trip) => trip !== title)
      : [...likedTrips, title];

    // Save liked trips for the specific user in localStorage
    if (userId) {
      localStorage.setItem(`${userId}_likedTrips`, JSON.stringify(updatedLikes));
    }
    setLikedTrips(updatedLikes);
  };

  return (
    <Layout>
      <div className="home-container">
        <HeroSection />
        
        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Popular Trips</h2>
          <div className="trip-container">
            {trips.map((trip) => (
              <TripCard
                key={trip.title}
                {...trip}
                onLike={() => handleLike(trip.title)}
                isLiked={likedTrips.includes(trip.title)}
              />
            ))}
          </div>
        </section>

        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Popular International Trips</h2>
          <div className="trip-container">
            {internationalTrips.map((trip) => (
              <TripCard
                key={trip.title}
                {...trip}
                onLike={() => handleLike(trip.title)}
                isLiked={likedTrips.includes(trip.title)}
              />
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2025 Voyagers. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default HomePage;
