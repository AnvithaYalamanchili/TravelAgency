import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { FaLock, FaHome } from "react-icons/fa";
import logo from "./logo.jpg";
import { jwtDecode } from "jwt-decode";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  AUD: "A$",
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    place_id,
    selectedSpots = [],
    finalTotal = 0,
    processingFee = 0,
    insuranceFee = 0,
    selectedCurrency = "USD",
    selectedCountry = "United States",
    insuranceSelected = false,
    travelDate,
    travelers = 1,
  } = location.state || {};

  const [placeDetails, setPlaceDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // User input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
  }, [place_id]);

  const convertAmount = (amount) => {
    const symbol = currencySymbols[selectedCurrency] || "";
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const handlePayment = async () => {
  // Extract user_id from JWT token
  const token = localStorage.getItem("access_token");
  let user_id = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    user_id = decodedToken.user_id;
  }

  const passengers = Array.from({ length: travelers }, (_, index) => ({
    full_name: `${fullName} ${index + 1}`, // Dummy names for each traveler
  }));

  // 🔥 Extract only spot_ids from selectedSpots
  const spot_ids = selectedSpots.map((spot) => spot.spot_id);

  const bookingData = {
    place_id,
    travel_date: travelDate,
    travelers,
    insurance_selected: insuranceSelected,
    final_total: finalTotal,
    processing_fee: processingFee,
    insurance_fee: insuranceFee,
    currency: selectedCurrency,
    country: selectedCountry,
    full_name: fullName,
    email,
    phone,
    user_id,
    passengers,
    spot_ids, // ✅ Send only spot IDs here
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/bookings/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("bookingData", JSON.stringify(data));
      setShowModal(true);
    } else {
      if (response.status === 401) {
        alert("You are not authorized. Please log in again.");
        navigate("/login");
      } else {
        alert("Booking failed. Please try again.");
      }
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("An error occurred. Please try again later.");
  }
};


  return (
    <div className="payment-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="home-btn" onClick={() => navigate("/home")}>
          <FaHome /> Home
        </button>
      </div>

      <div className="payment-content">
        {/* LEFT: Payment Form */}
        <div className="payment-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go back to Booking Page
          </button>

          <h2>Payment</h2>
          <p className="secure-text">
            <FaLock /> Payments are secure and encrypted
          </p>

          <div className="card-payment">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Phone</label>
            <input
              type="text"
              placeholder="1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="card-details">
              <div>
                <label>Card Number</label>
                <input type="text" placeholder="1234 1234 1234 1234" />
              </div>
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

          <button className="complete-btn" onClick={handlePayment}>
            Complete Booking
          </button>
        </div>

        {/* RIGHT: Summary */}
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

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Payment Successful!</h2>
            <p>Your booking is confirmed. You will receive a confirmation email shortly.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
