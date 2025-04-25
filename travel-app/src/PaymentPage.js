import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { FaLock, FaHome } from "react-icons/fa";
import logo from "./logo.jpg";
import { jwtDecode } from "jwt-decode";
import Layout from './Layout';

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
  }, [place_id, location.state]);

  const convertAmount = (amount) => {
    const symbol = currencySymbols[selectedCurrency] || "";
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    // Extract user_id from JWT token if not provided in state
    const token = localStorage.getItem("access_token");
    let user_id = stateUserId;
    if (!user_id && token) {
      const decodedToken = jwtDecode(token);
      user_id = decodedToken.user_id;
    }

    // Create passengers array
    const passengers = Array.from({ length: travelers }, (_, index) => ({
      full_name: `${fullName} ${index + 1}`,
    }));

    // Extract spot_ids from selectedSpots
    const spot_ids = selectedSpots.map((spot) => spot.spot_id);

    // Prepare booking data for the main booking
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
      spot_ids,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // First, create the main booking
      const bookingResponse = await fetch("http://127.0.0.1:8000/bookings/", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        if (bookingResponse.status === 401) {
          alert("You are not authorized. Please log in again.");
          navigate("/login");
          return;
        } else {
          throw new Error("Main booking failed");
        }
      }

      const bookingDataResponse = await bookingResponse.json();
      localStorage.setItem("bookingData", JSON.stringify(bookingDataResponse));

      // If guide is selected, create the guide booking
      if (guideSelected && stateGuideId && user_id) {
        const guideResponse = await fetch("http://127.0.0.1:8000/guide_bookings", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            user_id: user_id,
            guide_id: stateGuideId,
            booking_date: travelDate,
            trip_end_date: trip_end_date,
            trip_status: "pending",
            payment: guideFee,
            main_booking_id: bookingDataResponse.booking_id // Link to main booking if needed
          }),
        });

        if (!guideResponse.ok) {
          const errorText = await guideResponse.text();
          console.error("Guide booking failed:", errorText);
          // Continue even if guide booking fails, as main booking was successful
        }
      }

      setShowModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="payment-page">
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
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

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

            <button
              className="complete-btn"
              onClick={handlePayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Booking"}
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

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>🎉 Payment Successful!</h2>
              <p>Your booking is confirmed. You will receive a confirmation email shortly.</p>
              <button className="home-btn" onClick={() => navigate("/home")}>
                Go back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;