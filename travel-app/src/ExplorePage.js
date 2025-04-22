// ExplorePage.js
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { TripCard } from "./HomePage";

const ExplorePage = () => {
  const [internationalTrips, setInternationalTrips] = useState([]);
  const [likedTrips, setLikedTrips] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      const savedLikes = JSON.parse(localStorage.getItem(`${storedUserId}_likedTrips`) || "[]");
      setLikedTrips(savedLikes);
    }

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

    fetchInternationalTrips();
  }, []);

  const handleLike = (title) => {
    const updatedLikes = likedTrips.includes(title)
      ? likedTrips.filter((trip) => trip !== title)
      : [...likedTrips, title];

    if (userId) {
      localStorage.setItem(`${userId}_likedTrips`, JSON.stringify(updatedLikes));
    }
    setLikedTrips(updatedLikes);
  };

  return (
    <Layout>
      <div className="home-container">
        <h2 style={{ textAlign: 'center', color: 'black' }}>Explore International Destinations</h2>
        <div className="trip-container">
          {internationalTrips.length > 0 ? (
            internationalTrips.map((trip) => (
              <TripCard
                key={trip.location_id}
                title={trip.location_name}
                image={trip.image}
                location_id={trip.location_id}
                isLocation={true}
                onLike={() => handleLike(trip.location_name)}
                isLiked={likedTrips.includes(trip.location_name)}
              />
            ))
          ) : (
            <p>Loading locations...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
