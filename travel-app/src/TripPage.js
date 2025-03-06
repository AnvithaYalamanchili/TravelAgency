import React from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Layout from "./Layout";
import placesData from "./placesData";
import "./TripPage.css";

const TripPage = () => {
  const { destination } = useParams();
  const trip = placesData[destination];

  if (!trip) {
    return (
      <Layout>
        <h2 style={{ textAlign: "center" }}>Trip details not found.</h2>
      </Layout>
    );
  }

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
              <button className="select-button">Add</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};


export default TripPage;
