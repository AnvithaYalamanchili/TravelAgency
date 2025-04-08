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
          <img src="./travellers1.jpg" alt="Travel adventure" />
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

const TripCard = ({ title, image, isLocation, place_id, location_id }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    window.scrollTo(0, 0);
    if (isLocation) {
      navigate(`/places/${location_id}`, {
        state: { location_name: title },
      }); 
    } else {
      navigate(`/trip/${place_id}`, {
        state: { place_name: title },
      });
    }
  };

  return (
    <div className="trip-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <button className="trip-button" onClick={handleNavigation}>
        {isLocation ? "View Places" : "View Details"}
      </button>
    </div>
  );
};

const HomePage = () => {
  const [popularTrips, setPopularTrips] = useState([]);
  const [internationalTrips, setInternationalTrips] = useState([]);

  useEffect(() => {
    const fetchPopularTrips = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/places/location/4");
        if (!response.ok) throw new Error("Failed to fetch popular trips");
        const data = await response.json();
        setPopularTrips(data.places || []);
      } catch (error) {
        console.error("Error fetching popular trips:", error);
      }
    };

    const fetchInternationalTrips = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/locations");
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        const filteredLocations = (data.locations || []).filter(loc => loc.location_name !== "USA");
        setInternationalTrips(filteredLocations);
      } catch (error) {
        console.error("Error fetching international trips:", error);
      }
    };

    fetchPopularTrips();
    fetchInternationalTrips();
  }, []);

  return (
    <Layout>
      <div className="home-container">
        <HeroSection />

        {/* Popular Trips */}
        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Available Trips In The USA</h2>
          <div className="trip-container">
            {popularTrips.length > 0 ? (
              popularTrips.map((trip) => (
                <TripCard 
                  key={trip.place_id} 
                  title={trip.place_name} 
                  image={trip.image} 
                  place_id={trip.place_id} 
                  isLocation={false} 
                />
              ))
            ) : (
              <p>Loading popular trips...</p>
            )}
          </div>
        </section>

        {/* International Trips */}
        <section className="trip-section">
          <h2 style={{ color: 'black', textAlign: 'center' }}>Popular International Trips</h2>
          <div className="trip-container">
            {internationalTrips.length > 0 ? (
              internationalTrips.map((trip) => (
                <TripCard 
                  key={trip.location_id} 
                  title={trip.location_name} 
                  image={trip.image} 
                  location_id={trip.location_id}  // Pass location_id for "View Places"
                  location_name={trip.location_name}
                  isLocation={true} 
                />
              ))
            ) : (
              <p>Loading international trips...</p>
            )}
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
