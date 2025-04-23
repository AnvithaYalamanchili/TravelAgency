import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import "./PlacesPage.css";

const PlacesPage = () => {
  const { location_id } = useParams(); // Get location_id from the URL params
  const location = useLocation();
  const location_name = location.state?.location_name || "Selected Location"; // fallback if state is missing
  const [places, setPlaces] = useState([]); // State to store places data
  const [loading, setLoading] = useState(true); // Loading state to show loading indicator
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/places/location/${location_id}`);
        if (!response.ok) throw new Error("Failed to fetch places");
        const data = await response.json();
        setPlaces(data.places || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [location_id]); // Re-run the effect if location_id changes

  const handleViewDetails = (place_id) => {
    // Navigate to the trip page with the place_id as a URL parameter
    navigate(`/trip/${place_id}`);
  };

  return (
    <Layout>
      <div className="matched-places-container">
        <h1>Places in {location_name}</h1>
        {loading ? (
          <p>Loading places...</p>
        ) : places.length > 0 ? (
          <div className="matched-places-list">
            {places.map((place) => (
              <div key={place.place_id} className="matched-place-card">
                <img src={place.image} alt={place.place_name} />
                <h3>{place.place_name}</h3>
                <p>{place.place_overview}</p>
                <button 
                  className="view-details-button" 
                  onClick={() => handleViewDetails(place.place_id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No places found for this location.</p>
        )}
      </div>
    </Layout>
  );
};

export default PlacesPage;
