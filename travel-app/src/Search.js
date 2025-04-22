import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./PlacesPage.css"; // Reuse the same styles

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/places/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  const handleViewDetails = (place_id) => {
    navigate(`/trip/${place_id}`);
  };

  return (
    <Layout>
      <div className="matched-places-container">
        <h1>Search Results for "{query}"</h1>
        {loading ? (
          <p>Loading search results...</p>
        ) : results.length > 0 ? (
          <div className="matched-places-list">
            {results.map((place) => (
              <div key={place.place_id} className="matched-place-card">
                <img src={place.main_image} alt={place.place_name} />
                <h3>{place.place_name}</h3>
                <p>{place.short_description}</p>
                <button className="view-details-button" onClick={() => handleViewDetails(place.place_id)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No places found matching your search.</p>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
