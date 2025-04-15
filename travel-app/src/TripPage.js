import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import "./TripPage.css";
import { FaHome } from "react-icons/fa";
import logo from "./logo.jpg"; // Ensure it's inside src
import Layout from "./Layout";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  AUD: "$",
};

const TripPage = () => {
  const { place_id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [defaultPlaces, setDefaultPlaces] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rates, setRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/place/${place_id}`);
        if (!response.ok) throw new Error("Failed to fetch trip details");
        const data = await response.json();
        const imagesArray = data.explore_images ? data.explore_images.split(",") : [];
        setTrip({ ...data, images: imagesArray });
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    const fetchDefaultPlaces = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/spots/place/${place_id}`);
        if (!response.ok) throw new Error("Failed to fetch spots");
        const data = await response.json();
        setDefaultPlaces(data.spots || []);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    };

    const fetchRates = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/latest?from=USD");
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchTripDetails();
    fetchDefaultPlaces();
    fetchRates();
  }, [place_id]);

  const convertPrice = (usdPrice) => {
    if (selectedCurrency === "USD") return `${currencySymbols.USD}${usdPrice.toFixed(2)}`;
    return `${currencySymbols[selectedCurrency]}${(usdPrice * (rates[selectedCurrency] || 1)).toFixed(2)}`;
  };

  const toggleSpotSelection = (spot) => {
    let updatedSelectedSpots;
    if (selectedSpots.some((s) => s.spot_id === spot.spot_id)) {
      updatedSelectedSpots = selectedSpots.filter((s) => s.spot_id !== spot.spot_id);
    } else {
      updatedSelectedSpots = [...selectedSpots, spot];
    }
    setSelectedSpots(updatedSelectedSpots);
    const newTotal = updatedSelectedSpots.reduce((sum, s) => sum + parseFloat(s.price), 0);
    setTotalAmount(newTotal);
  };

  const handleCheckAvailability = () => {
    if (selectedSpots.length >= 4) {
      navigate("/booking", { state: { place_id, selectedSpots, totalAmount } });
    }
  };

  if (!trip) return <h2 style={{ textAlign: "center" }}>Trip details not found.</h2>;

  return (
    <Layout>
    
        <div className="currency-selector">
          <label>Currency:</label>
          <select onChange={(e) => setSelectedCurrency(e.target.value)} value={selectedCurrency}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="AUD">AUD</option>
          </select>
        </div>

      <div className="trip-details">
        <h1 style={{ textAlign: "center" }}>Explore {trip.place_name}</h1>
        <Swiper modules={[Navigation, Autoplay]} navigation autoplay={{ delay: 3000 }} spaceBetween={10} slidesPerView={1}>
          {trip.images.length > 0 ? (
            trip.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`slide-${index}`} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <img src="default-image.jpg" alt="default" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            </SwiperSlide>
          )}
        </Swiper>

        <div className="tour-and-cost">
          <div className="tour-details">
            <h2>Tour Overview</h2>
            <p>{trip.description}</p>
            <h2>Tour Package Details</h2>
            <ul>
              <li><strong>Duration:</strong> {trip.duration}</li>
              <li><strong>Transportation:</strong> {trip.transportation}</li>
              <li><strong>Accommodation:</strong> {trip.accommodation}</li>
              <li><strong>Meals:</strong> {trip.meals}</li>
            </ul>
          </div>
          <div className="total-cost-section">
            <h2>Total Cost Per Person</h2>
            <p><strong>{selectedCurrency} {convertPrice(totalAmount)}</strong></p>
            {selectedSpots.length > 0 && (
          <div className="selected-spots">
            <h4>Selected Spots:</h4>
            <ul>
              {selectedSpots.map((spot) => (
                <li key={spot.spot_id}>
                  {spot.spot_name} - {convertPrice(spot.price)}
                </li>
              ))}
            </ul>
          </div>
        )}
            <button 
              className="book-now-btn" 
              disabled={selectedSpots.length < 4}
              onClick={handleCheckAvailability}
            >
              {selectedSpots.length < 4 ? "Select at least 4 places" : "Book Now"}
            </button>
          </div>
        </div>

        <h2>Select Your Spots</h2>
        <p>Number of Places Selected: {selectedSpots.length}</p>
        <div className="default-places">
          {defaultPlaces.length > 0 ? (
            defaultPlaces.map((place) => (
              <div key={place.spot_id} className={`place-card ${selectedSpots.some(s => s.spot_id === place.spot_id) ? "selected" : ""}`} onClick={() => toggleSpotSelection(place)}>
                <img src={place.image} alt={place.spot_name} className="place-image" />
                <p>{place.spot_name} - <strong>{convertPrice(place.price)}</strong></p>
              </div>
            ))
          ) : (
            <p>Loading spots...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TripPage;
