import React from "react";
import "./HomePage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout"; // Import Layout component

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Swiper modules={[Navigation, Autoplay]} navigation autoplay={{ delay: 3000 }}>
        <SwiperSlide>
          <img src="./travellers1.jpg" alt="Travel adventure" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="./beach.jpg" alt="Adventure" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="./scenary.jpg" alt="Scenic view" />
        </SwiperSlide>
      </Swiper>
      <div className="hero-text">
        Find Your Travel Mate and Explore the World Together...
      </div>
    </div>
  );
};

const TripCard = ({ title, image }) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
  navigate(`/trip/${title.toLowerCase().replace(/\s+/g, '')}`);
};


  return (
    <div className="trip-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <button className="trip-button" onClick={handleBookNow}>Book now</button>
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
  return (
    <Layout> 
      <div className="home-container">
        <HeroSection />

        {/* Popular Trips */}
        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Popular Trips</h2>
          <div className="trip-container">
            {trips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>

        {/* International Trips */}
        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Popular International Trips</h2>
          <div className="trip-container">
            {internationalTrips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 Voyagers. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default HomePage;
