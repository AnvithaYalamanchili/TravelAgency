import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { FaLock, FaHome } from "react-icons/fa";
import logo from "./logo.jpg";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  AUD: "A$",
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const guide_name = location.state?.guide_name || "Not selected";
  const {
    user_id: stateUserId,
    guide_id: stateGuideId,
    trip_end_date,
    place_id,
    selectedSpots = [],
    finalTotal = 0,
    processingFee = 0,
    insuranceFee = 0,
    guideFee = 0,
    selectedCurrency = "USD",
    selectedCountry = "United States",
    insuranceSelected = false,
    guideSelected = false,
    travelDate,
    travelers = 1,
  } = location.state || {};

  const [placeDetails, setPlaceDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (place_id) fetchPlaceDetails();
  }, [place_id, location.state]);

  const convertAmount = (amount) => {
    const symbol = currencySymbols[selectedCurrency] || "";
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    if (stateGuideId && stateUserId) {
      try {
        const response = await fetch("http://127.0.0.1:8000/guide_bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: stateUserId,
            guide_id: stateGuideId,
            booking_date: travelDate,
            trip_end_date,
            trip_status: "pending",
            payment: guideFee,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Booking failed: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Guide booking successful:", data);
      } catch (error) {
        console.error("❌ Error booking guide:", error);
      }
    } else {
      console.error("❗ Guide ID or User ID is missing");
    }

    setShowModal(true);
    setIsSubmitting(false);
  };

  return (
    <div className="payment-page">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="home-btn" onClick={() => navigate("/home")}>
          <FaHome /> Home
        </button>
      </div>

      <div className="payment-content">
        <div className="payment-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go back to Booking Page
          </button>

          <h2>Payment</h2>
          <p className="secure-text">
            <FaLock /> Payments are secure and encrypted
          </p>

          <div className="card-payment">
            <label>Card Number</label>
            <input type="text" placeholder="1234 1234 1234 1234" />

            <div className="card-details">
              <div>
                <label>Expiration Date</label>
                <input type="text" placeholder="MM / YY" />
              </div>
              <div>
                <label>Security Code</label>
                <input type="text" placeholder="CVC" />
              </div>
            </div>

            <label>Country</label>
            <select defaultValue={selectedCountry}>
              <option>India</option>
              <option>United States</option>
              <option>Australia</option>
              <option>European Union</option>
            </select>

            <label>ZIP Code</label>
            <input type="text" placeholder="12345" />
          </div>

          <button
            className="complete-btn"
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </button>
        </div>

        <div className="booking-summary">
          {placeDetails ? (
            <>
              <img
                src={placeDetails.image}
                alt={placeDetails.place_name}
                className="place-image"
              />
              <h3>Trip to {placeDetails.place_name}</h3>
              <h4>📍 Places you are going to visit:</h4>
              <ul className="spot-list">
                {selectedSpots.length > 0 ? (
                  selectedSpots.map((spot) => (
                    <li key={spot.spot_id}>
                      {spot.spot_name} - {convertAmount(spot.price)}
                    </li>
                  ))
                ) : (
                  <li>No spots selected</li>
                )}
              </ul>
              <p>⏳ Duration: {placeDetails.duration}</p>
              <p>📅 Travel Date: {travelDate || "Not selected"}</p>
              <p>👥 Number of Travelers: {travelers}</p>
              <p>💰 Processing Fee: {convertAmount(processingFee)}</p>
              {insuranceSelected && (
                <p>🛡 Insurance: {convertAmount(insuranceFee)}</p>
              )}
              {guideSelected && (
                <>
                  <p>🧭 Guide: {guide_name}</p>
                  <p>💵 Guide Fee: {convertAmount(guideFee)}</p>
                </>
              )}
              <hr />
              <h3>
                Total: <strong>{convertAmount(finalTotal)}</strong>
              </h3>
            </>
          ) : (
            <p>Loading place details...</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Payment Successful!</h2>
            <p>Your booking has been completed.</p>
            <button className="home-btn" onClick={() => navigate("/home")}>
              Go back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
