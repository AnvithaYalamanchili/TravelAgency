import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Layout from "./Layout";
import placesData from "./placesData";
import "./TripPage.css";
import { useNavigate } from "react-router-dom";



const TripPage = () => {
  const { destination } = useParams();
  const trip = placesData[destination];
  const streetViewRef = useRef(null);
  const navigate = useNavigate(); 
  const [showStreetView, setShowStreetView] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the selected place for 360° view

  useEffect(() => {
    if (showStreetView && window.google && selectedPlace) {
      const streetView = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: selectedPlace.lat, lng: selectedPlace.lon },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
      });
    }
  }, [showStreetView, selectedPlace]);

  if (!trip) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center" }}>Trip details not found.</h2>
      </Layout>
    );
  }

  const handleStreetViewClick = (place) => {
    setSelectedPlace(place);
    setShowStreetView(true);
  };


  const handleNavigate = (place) => {
  navigate(`/places/${place.name}`); // Redirect to another page dynamically
};


  return (
    <Layout>
      <div className="trip-details">
        <h1 style={{ textAlign: "center" }}>Explore {destination.toUpperCase()}</h1>

        {/* Swiper for Top Images */}
        <Swiper modules={[Navigation, Autoplay]} navigation autoplay={{ delay: 3000 }} spaceBetween={10} slidesPerView={1}>
          {trip.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`slide-${index}`} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Tour and Cost Details Section */}
        <div className="tour-and-cost">
          <div className="tour-details">
            <h2>Tour Overview</h2>
            <p>{trip.detailedDescription}</p>

            <h2>Tour Package Details</h2>
            <ul>
              <li><strong>Duration:</strong> {trip.duration}</li>
              <li><strong>Transportation:</strong> {trip.transportation}</li>
              <li><strong>Number of Places:</strong> {trip.numberOfPlaces}</li>
              <li><strong>Accommodation:</strong> {trip.accommodation}</li>
              <li><strong>Meals:</strong> {trip.meals}</li>
            </ul>
          </div>

          {/* Total Package Cost */}
          <div className="total-cost">
            <h2>Total Cost</h2>
            <p><strong>${trip.totalCost}</strong> per person</p>
          </div>
        </div>

        {/* Default Package Includes */}
        <h2>Default Package Includes</h2>
        <div className="default-places">
          {trip.defaultPlaces.map((place, index) => (
            <div key={index} className="place-card">
              <img src={place.image} alt={place.name} className="place-image" />
              <p>{place.name} - <strong>${place.price}</strong></p>
              <button className="select-button" onClick={() => handleNavigate(place)}>
  View Details
</button>
            </div>
          ))}
        </div>

        {/* Additional Places */}
        <h2>Choose Additional Places:</h2>
        <div className="additional-places">
          {trip.otherPlaces.map((place, index) => (
            <div key={index} className="place-card">
              <img src={place.image} alt={place.name} className="place-image" />
              <p>{place.name} - <strong>${place.price}</strong></p>
              <button className="select-button" onClick={() => handleNavigate(place)}>
  View Details
</button>
            </div>
          ))}
        </div>

        {/* Floating Button for 360° View */}
        <button className="floating-button" onClick={() => setShowStreetView(true)}>
          360° View
        </button>

        {/* Modal for Street View */}
        {showStreetView && selectedPlace && (
          <div className="street-view-modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setShowStreetView(false)}>&times;</span>
              <div ref={streetViewRef} className="street-view-container"></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TripPage;
