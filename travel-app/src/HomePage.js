import React from "react";
import "./HomePage.css";
import Sidebar from "./SideBar";
import { FaBell, FaUser ,FaInfoCircle} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

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
  return (
    <div className="trip-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <button className="trip-button">Book now</button>
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
    <div className="home-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="main-content">
        {/* Navbar */}
        <nav>
  <img style={{ height: '100px' }} src="./logo.png" alt="" />
  <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '100px' }}>
    <FaInfoCircle style={{ color: '#F8C923', fontSize: '30px', marginRight: '5px' }} />
    <p style={{ fontSize: '15px', padding: '5px 10px', whiteSpace: 'nowrap', margin: '0' }}>About Us</p>
<button className="book-now-btn-nav">
  Book Now
</button>
    <FaBell style={{ color: '#F8C923', fontSize: '30px', marginLeft: '50px' }} />
    
  </div>

  <div className="search-div">
    <input type="text" placeholder="Search" />
    <FaUser style={{ color: '#F8C923', fontSize: '30px', marginLeft: '70px' }} />
  </div>
</nav>
        <HeroSection />

        {/* Popular Trips */}
        <section className="trip-section">
          <h2 style={{'color':'black','textAlign':'center'}}>Popular Trips</h2>
          <div className="trip-container">
            {trips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>

        {/* International Trips */}
        <section className="trip-section">
          <h2 style={{'color':'black','textAlign':'center'}}>Popular International Trips</h2>
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
    </div>
  );
};

export default HomePage;
