import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import "./SpotsPage.css";

const SpotsPage = () => {
  const { place_id } = useParams();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/spots/${place_id}`);
        if (!response.ok) throw new Error("Failed to fetch spots");

        const data = await response.json();
        setSpots(data.spots || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [place_id]);

  return (
    <Layout>
      <div className="spots-container">
        <h2 style={{ textAlign: "center" }}>Spots in Matched Place</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="spots-list">
          {spots.length > 0 ? (
            spots.map((spot) => (
              <div key={spot.spot_id} className="spot-card">
                <img src={spot.image} alt={spot.spot_name} loading="lazy" />
                <h3>{spot.spot_name}</h3>
                <p>{spot.spot_description}</p>
                <p>
                  <strong>Price:</strong> ${spot.price}
                </p>
              </div>
            ))
          ) : (
            !loading && <p>No spots found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SpotsPage;
