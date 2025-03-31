import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import placesData from "./placesData";
import "./PlacesDetails.css";

const PlaceDetails = () => {
  const { stateName } = useParams();
  const decodedStateName = decodeURIComponent(stateName); 
  const streetViewRef = useRef(null);
  const [showStreetView, setShowStreetView] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (showStreetView && window.google && selectedPlace && streetViewRef.current) {
      new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: selectedPlace.lat, lng: selectedPlace.lon },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
      });
    }
  }, [showStreetView, selectedPlace]);

  const handleStreetViewClick = (place) => {
    setSelectedPlace(place);
    setShowStreetView(true);
  };

  if (!decodedStateName) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center" }}>State name is missing in the URL.</h2>
      </Layout>
    );
  }

  // Find the country and state
  let countryName = null;
  let stateData = null;

  for (const [key, country] of Object.entries(placesData)) {
    if (country.states && country.states[decodedStateName]) {
      countryName = country.name || key;
      stateData = country.states[decodedStateName];
      break;
    }
  }

  if (!countryName || !stateData) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center" }}>State {decodedStateName} not found.</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="state-details">
        <h1 style={{ textAlign: "center" }}>
          Places in {decodedStateName}, {countryName}
        </h1>
        <div className="places-container">
          {stateData.places && stateData.places.length > 0 ? (
            stateData.places.map((place, index) => (
              <div key={index} className="place-card">
                <div className="place-image">
                  <img src={place.image} alt={place.name} className="place-image-img" />
                </div>
                <div className="place-info">
                  <h3>{place.name}</h3>
                  <p><strong>Price:</strong> ${place.price}</p>
                  <button onClick={() => handleStreetViewClick(place)}>
                    View 360° Street View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No places found in this state.</p>
          )}
        </div>
      </div>

      {/* Street View Modal */}
      {showStreetView && selectedPlace && (
        <div className="street-view-modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowStreetView(false)}>
              ×
            </span>
            <div ref={streetViewRef} className="street-view-container"></div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlaceDetails;
