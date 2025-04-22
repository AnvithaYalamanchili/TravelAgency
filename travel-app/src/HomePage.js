import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

// Hero Section with Slider
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

// TripCard Component with heart animation and Like functionality
export const TripCard = ({ title, image, onLike, isLiked, isLocation, place_id, location_id, place_overview }) => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);

  const handleBookNow = () => {
    window.scrollTo(0, 0);
    if (isLocation) {
      navigate(`/places/${location_id}`, {
        state: { location_name: title },
      });
    }
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

      {/* ✅ Add this block to show the description */}
      {place_overview && <p className="trip-description">{place_overview}</p>}

      <button className="trip-button" onClick={handleBookNow}>
        {isLocation ? "View Places" : "View Details"}
      </button>

      <span className={`heart ${isLiked ? "liked" : ""}`} onClick={handleHeartClick}>
        {isLiked ? "❤️" : "🤍"}
      </span>

      {hearts.map((heart, index) => (
        <div key={index} className="animated-heart" style={{ left: heart.x - 25, top: heart.y - 25 }}>
          ❤️
        </div>
      ))}
    </div>
  );
};


const HomePage = () => {
  const [likedTrips, setLikedTrips] = useState([]);
  const [userId, setUserId] = useState(null);
  const [popularTrips, setPopularTrips] = useState([]);
  const [internationalTrips, setInternationalTrips] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (storedUserId) {
      setUserId(storedUserId); // Set the user_id
    }

    // Retrieve liked trips for the specific user
    if (storedUserId) {
      const savedLikes = JSON.parse(localStorage.getItem(`${storedUserId}_likedTrips`) || "[]");
      setLikedTrips(savedLikes);
    }

    // Fetch popular trips
    const fetchPopularTrips = async () => {
   try {
      const response = await fetch("http://127.0.0.1:8000/places/location/4");
      if (!response.ok) throw new Error("Failed to fetch popular trips");
      const data = await response.json();
      console.log(data); // Add this to log the response
      setPopularTrips(data.places || []);
   } catch (error) {
      console.error("Error fetching popular trips:", error);
   }
};


    // Fetch international trips
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

  const handleLike = (title) => {
    const updatedLikes = likedTrips.includes(title)
      ? likedTrips.filter((trip) => trip !== title)
      : [...likedTrips, title];

    // Save liked trips for the specific user
    if (userId) {
      localStorage.setItem(`${userId}_likedTrips`, JSON.stringify(updatedLikes));
    }
    setLikedTrips(updatedLikes);
  };

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
                  onLike={() => handleLike(trip.place_name)}
                  isLiked={likedTrips.includes(trip.place_name)}
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
  internationalTrips.slice(0, 6).map((trip) => (
    <TripCard
  key={trip.location_id}
  title={trip.location_name}
  image={trip.image}
  location_id={trip.location_id}
  isLocation={true}
  place_overview={trip.place_overview} // ✅ Correct prop name
  onLike={() => handleLike(trip.location_name)}
  isLiked={likedTrips.includes(trip.location_name)}
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
