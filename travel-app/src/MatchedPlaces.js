import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ← Added useParams
import Layout from "./Layout";
import "./MatchedPlaces.css";

const LocationCard = ({ location_id, location_name, image, onSelect }) => (
  <div className="location-card" onClick={() => onSelect(location_id)}>
    <img src={image} alt={`Image of ${location_name}`} loading="lazy" />
    <h3>{location_name}</h3>
  </div>
);

const MatchedPlaceCard = ({ place_id, place_name, image, place_overview }) => {
  const navigate = useNavigate();

  return (
    <div className="matched-place-card">
      <img src={image} alt={`Image of ${place_name}`} loading="lazy" />
      <h3>{place_name}</h3>
      <p>{place_overview}</p>
      <button
        className="view-details-button"
        onClick={() => navigate(`/trip/${place_id}`)}
      >
        View Details
      </button>
    </div>
  );
};

const MatchedPlaces = () => {
  const { location_id } = useParams(); // ← Get the location_id from URL
  const [locations, setLocations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      setError("Please log in to view matched places.");
      setLoading(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/locations");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setLocations(data.locations || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [user_id]);

  const fetchPlaces = async (locId) => {
    setSelectedLocation(locId);
    setPlacesLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/recommendations/${user_id}/${locId}`
      );
      if (!response.ok) throw new Error("Failed to fetch places");

      const data = await response.json();
      setPlaces(data.recommended_places || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setPlacesLoading(false);
    }
  };

  // Automatically fetch matched places if location_id is in URL
  useEffect(() => {
    if (location_id) {
      fetchPlaces(location_id);
    }
  }, [location_id]);

  return (
    <Layout>
      <div className="matched-places-container">
        <h2 style={{ color: "black", textAlign: "center" }}>
          {selectedLocation ? "Matched Places" : "Select a Location"}
        </h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!selectedLocation ? (
          <div className="locations-list">
            {locations.length > 0 ? (
              locations.map((location) => (
                <LocationCard
                  key={location.location_id}
                  {...location}
                  onSelect={fetchPlaces}
                />
              ))
            ) : (
              !loading && <p>No locations found.</p>
            )}
          </div>
        ) : (
          <div className="matched-places-list">
            {placesLoading ? (
              <p>Loading places...</p>
            ) : places.length > 0 ? (
              places.map((place) => (
                <MatchedPlaceCard key={place.place_id} {...place} />
              ))
            ) : (
              <p>No matched places found.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchedPlaces;
