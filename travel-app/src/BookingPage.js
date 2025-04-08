import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";
import { FaHome } from "react-icons/fa";
import logo from "./logo.jpg";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  AUD: "A$",
};

const currencyToCountry = {
  USD: "United States",
  EUR: "European Union",
  INR: "India",
  AUD: "Australia",
};

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { place_id, totalAmount, selectedSpots } = location.state || {};

  const [placeDetails, setPlaceDetails] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [userDetails, setUserDetails] = useState({ fullName: "", email: "", phone: "" });
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({ USD: 1 });

  const selectedCountry = currencyToCountry[selectedCurrency] || "United States";

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/place/${place_id}`);
        if (!response.ok) throw new Error("Failed to fetch place details");
        const data = await response.json();
        setPlaceDetails(data);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/latest?from=USD");
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        const data = await response.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    if (place_id) fetchPlaceDetails();
    fetchExchangeRates();
  }, [place_id]);

  const rate = exchangeRates[selectedCurrency] || 1;

  // All values are in selected currency
  const baseProcessingFee = travelers * 0.25;
  const baseInsuranceFee = totalAmount * 0.05 * travelers;
  const baseFinalTotal = totalAmount * travelers + baseProcessingFee + (insuranceSelected ? baseInsuranceFee : 0);

  const convertedProcessingFee = (baseProcessingFee * rate).toFixed(2);
  const convertedInsuranceFee = (baseInsuranceFee * rate).toFixed(2);
  const convertedFinalTotal = (baseFinalTotal * rate).toFixed(2);

  const convertAmount = (amount) => {
    return `${currencySymbols[selectedCurrency] || ""}${parseFloat(amount).toFixed(2)}`;
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelerChange = (newCount) => {
    setTravelers(newCount);
    setPassengerDetails(newCount > 1 ? Array(newCount - 1).fill({ fullName: "" }) : []);
  };

  const handlePassengerChange = (index, value) => {
    const updated = [...passengerDetails];
    updated[index].fullName = value;
    setPassengerDetails(updated);
  };

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        place_id,
        selectedSpots,
        finalTotal: convertedFinalTotal,
        processingFee: convertedProcessingFee,
        insuranceFee: convertedInsuranceFee,
        selectedCurrency,
        selectedCountry,
        travelDate,
        travelers,
        insuranceSelected,
      },
    });
  };

  return (
    <div className="booking-page">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="home-btn" onClick={() => navigate("/home")}>
          <FaHome /> Home
        </button>
        <div className="currency-selector">
          <label>Currency:</label>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
            {Object.keys(currencySymbols).map((curr) => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="booking-content">
        <div className="booking-container">
          <h2>Booking Details</h2>

          <div className="form-group">
            <label>Number of Travelers</label>
            <select value={travelers} onChange={(e) => handleTravelerChange(Number(e.target.value))}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Travel Date</label>
            <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          </div>

          <h3>User Details</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={userDetails.fullName} onChange={handleUserDetailsChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={userDetails.email} onChange={handleUserDetailsChange} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="mobile" name="phone" value={userDetails.phone} onChange={handleUserDetailsChange} />
          </div>

          {travelers > 1 && (
            <>
              <h3>Additional Passenger Details</h3>
              {passengerDetails.map((_, index) => (
                <div key={index} className="form-group">
                  <label>Passenger {index + 2} Full Name</label>
                  <input type="text" value={passengerDetails[index].fullName} onChange={(e) => handlePassengerChange(index, e.target.value)} />
                </div>
              ))}
            </>
          )}

          <div className="insurance-container">
            <h3>Travel Insurance & Cancellation Protection</h3>
            <div className={`insurance-box ${insuranceSelected ? "selected" : ""}`} onClick={() => setInsuranceSelected(!insuranceSelected)}>
              <input type="checkbox" checked={insuranceSelected} onChange={() => setInsuranceSelected(!insuranceSelected)} />
              <div className="insurance-details">
                <h4>Voyagers <span>PLUS</span></h4>
                <p>✔ Refund for Illness, Adverse Weather & More</p>
                <p><strong>Cost:</strong> {convertAmount(convertedInsuranceFee)}</p>
              </div>
            </div>
          </div>

          <button className="proceed-btn" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </div>

        <div className="booking-summary">
          {placeDetails ? (
            <>
              <img src={placeDetails.image} alt={placeDetails.place_name} className="place-image" />
              <h3>Trip to {placeDetails.place_name}</h3>
              <h4>📍 Places you are going to visit:</h4>
              <ul className="spot-list">
                {selectedSpots.length > 0 ? selectedSpots.map((spot) => (
                  <li key={spot.spot_id}>{spot.spot_name}</li>
                )) : <li>No spots selected</li>}
              </ul>
              <p>⏳ Duration: {placeDetails.duration}</p>
              <p>📅 Travel Date: {travelDate || "Not selected"}</p>
              <p>👥 Travelers: {travelers}</p>
              <p>💰 Processing Fee: {convertAmount(convertedProcessingFee)}</p>
              {insuranceSelected && <p>🛡 Insurance: {convertAmount(convertedInsuranceFee)}</p>}
              <hr />
              <h3>Total: <strong>{convertAmount(convertedFinalTotal)}</strong></h3>
            </>
          ) : <p>Loading place details...</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
