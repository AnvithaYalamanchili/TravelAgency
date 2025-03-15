import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./Locations.css";

const LocationCard = ({ location_id, location_name, image }) => {
  const navigate = useNavigate();

  const handleSelectLocation = () => {
    navigate(`/MatchedPlaces/${location_id}`);
  };

  return (
    <div className="location-card" onClick={handleSelectLocation}>
      <img src={image} alt={`Image of ${location_name}`} loading="lazy" />
      <h3>{location_name}</h3>
    </div>
  );
};

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track component mount state

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/locations");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch locations`);
        }
        const data = await response.json();
        if (isMounted) setLocations(data.locations || []);
      } catch (error) {
        if (isMounted) setError(error.message);
        console.error("Fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLocations();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  return (
    <Layout>
      <div className="locations-container">
        <h2 style={{ textAlign: "center", color: "black" }}>Select a Location</h2>

        {loading ? <p>Loading...</p> : error ? <p style={{ color: "red" }}>{error}</p> : null}

        <div className="locations-list">
          {locations.length > 0 ? (
            locations.map((location) => (
              <LocationCard key={location.location_id} {...location} />
            ))
          ) : (
            !loading && <p>No locations found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Locations;
