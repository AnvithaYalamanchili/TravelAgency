import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";
import { FaHome } from "react-icons/fa";
import logo from "./logo.jpg";
import Layout from "./Layout";

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

  const [guideSelected, setGuideSelected] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideDetailsVisible, setGuideDetailsVisible] = useState(null); // To manage which guide details to show

  const selectedCountry = currencyToCountry[selectedCurrency] || "United States";

  useEffect(() => {
    if (!place_id) return;

    const fetchData = async () => {
      try {
        const [placeRes, rateRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/place/${place_id}`),
          fetch("https://api.frankfurter.app/latest?from=USD"),
        ]);

        if (!placeRes.ok || !rateRes.ok) throw new Error("Fetch error");

        const placeData = await placeRes.json();
        const rateData = await rateRes.json();

        setPlaceDetails(placeData);
        setExchangeRates({ ...rateData.rates, USD: 1 });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [place_id]);

  const rate = exchangeRates[selectedCurrency] || 1;

  const baseProcessingFee = travelers * 0.25;
  const baseInsuranceFee = totalAmount * 0.05 * travelers;
  const baseFinalTotal = totalAmount * travelers + baseProcessingFee + (insuranceSelected ? baseInsuranceFee : 0);

  const guideFee = (() => {
    if (!placeDetails?.duration || !guideSelected) return 0;
    const duration = placeDetails.duration.toLowerCase();
    const days = parseInt(duration.match(/(\d+)\s*day/)?.[1] || "0");
    const nights = parseInt(duration.match(/(\d+)\s*night/)?.[1] || "0");
    return (days * 25 + nights * 30) * rate;
  })();

  const convertAmount = (amount) => `${currencySymbols[selectedCurrency] || ""}${parseFloat(amount).toFixed(2)}`;

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

  const fetchGuides = async () => {
    try {
      const [allGuidesRes, unavailableGuidesRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/guides/by/${place_id}`),
        fetch(`http://127.0.0.1:8000/unavailable_guides?date=${travelDate}`),
      ]);
  
      if (!allGuidesRes.ok || !unavailableGuidesRes.ok) throw new Error("Failed to fetch guides");
  
      const allGuides = await allGuidesRes.json();
      const unavailableGuideIds = await unavailableGuidesRes.json();
  
      const availableGuides = allGuides.filter(
        (guide) => !unavailableGuideIds.includes(guide.guide_id)
      );
  
      setGuides(availableGuides);
      setShowGuideModal(true);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const handleGuideToggle = () => {
    if (!travelDate) {
      alert("Please select a travel date before selecting a guide.");
      return;
    }
    if (!guideSelected) fetchGuides();
    else setSelectedGuide(null);
    setGuideSelected(!guideSelected);
  };

  const handleProceedToPayment = () => {
    if (!userDetails.fullName || !userDetails.email || !travelDate) {
      alert("Please complete your name, email, and travel date before proceeding.");
      return;
    }

    const totalWithGuide = baseFinalTotal * rate + (guideSelected ? guideFee : 0);
    const userId = localStorage.getItem("user_id"); // or from context/auth
    let tripEndDate = "";

    if (placeDetails?.duration && travelDate) {
      const match = placeDetails.duration.match(/(\d+)\s*day/);
      const days = parseInt(match?.[1] || "0", 10);
      const startDate = new Date(travelDate);
      startDate.setDate(startDate.getDate() + days);
      tripEndDate = startDate.toISOString().split("T")[0]; // format YYYY-MM-DD
    }


    navigate("/payment", {
      state: {
        place_id,
        selectedSpots,
        finalTotal: totalWithGuide.toFixed(2),
        processingFee: (baseProcessingFee * rate).toFixed(2),
        insuranceFee: (baseInsuranceFee * rate).toFixed(2),
        guideFee: guideFee.toFixed(2),
        selectedCurrency,
        selectedCountry,
        travelDate,
        travelers,
        insuranceSelected,
        guideSelected,
        selectedGuide,
        user_id: userId,
        guide_id: selectedGuide?.guide_id || null,
        guide_name: selectedGuide?.guide_name || null, 
        trip_end_date: tripEndDate,
      },
    });
  };

  return (
    <Layout>
    <div className="booking-page">
      <div className="currency-selector">
          <label>Currency:</label>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
            {Object.keys(currencySymbols).map((curr) => (
              <option key={curr} value={curr}>
                {curr} - {currencyToCountry[curr]}
              </option>
            ))}
          </select>
        </div>

      <div className="booking-content">
        <div className="booking-container">
          <h2>Booking Details</h2>

          <div className="form-group">
            <label>Number of Travelers</label>
            <select value={travelers} onChange={(e) => handleTravelerChange(Number(e.target.value))}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
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

          {travelers > 1 &&
            passengerDetails.map((_, index) => (
              <div key={index} className="form-group">
                <label>Passenger {index + 2} Full Name</label>
                <input type="text" value={passengerDetails[index].fullName} onChange={(e) => handlePassengerChange(index, e.target.value)} />
              </div>
            ))}

          <div className="insurance-container">
            <h3>Travel Insurance & Cancellation Protection</h3>
            <div
              className={`insurance-box ${insuranceSelected ? "selected" : ""}`}
              onClick={() => setInsuranceSelected(!insuranceSelected)}
            >
              <input type="checkbox" checked={insuranceSelected} onChange={() => setInsuranceSelected(!insuranceSelected)} />
              <div className="insurance-details">
                <h4>Voyagers <span>PLUS</span></h4>
                <p>✔ Refund for Illness, Adverse Weather & More</p>
                <p>
                  <strong>Cost:</strong> {convertAmount(baseInsuranceFee * rate)}
                </p>
              </div>
            </div>
          </div>

          <div className="guide-container">
            <h3>Local Guide</h3>
            <div className={`guide-box ${guideSelected ? "selected" : ""}`} onClick={handleGuideToggle}>
              <input type="checkbox" checked={guideSelected} onChange={handleGuideToggle} />
              <div className="guide-details">
                <h4>Local Guide Assistance</h4>
                {selectedGuide ? (
                  <p>👤 {selectedGuide.guide_name}</p>
                ) : (
                  <p>Select a guide for this trip</p>
                )}
                <p><strong>Cost:</strong> {convertAmount(guideFee)}</p>
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
                {selectedSpots?.length > 0 ? selectedSpots.map((spot) => (
                  <li key={spot.spot_id}>{spot.spot_name}</li>
                )) : <li>No spots selected</li>}
              </ul>
              <p>⏳ Duration: {placeDetails.duration}</p>
              <p>📅 Travel Date: {travelDate || "Not selected"}</p>
              <p>👥 Travelers: {travelers}</p>
              <p>💰 Processing Fee: {convertAmount(baseProcessingFee * rate)}</p>
              {insuranceSelected && <p>🛡 Insurance: {convertAmount(baseInsuranceFee * rate)}</p>}
              {guideSelected && selectedGuide && (
                <>
                  <p>🧭 Guide: {selectedGuide.guide_name}</p>
                  <p>💵 Guide Fee: {convertAmount(guideFee)}</p>
                </>
              )}
              <hr />
              <h3>Total: <strong>{convertAmount(baseFinalTotal * rate + (guideSelected ? guideFee : 0))}</strong></h3>
            </>
          ) : <p>Loading place details...</p>}
        </div>
      </div>

      {/* Modal for Guide Selection */}
      {showGuideModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select a Local Guide</h2>
            <button className="close-btn" onClick={() => setShowGuideModal(false)}>X</button>
            <div className="guide-list">
              {guides.length > 0 ? guides.map((guide) => (
                <div key={guide.guide_id} className="guide-card">
                  <img src={guide.guide_image} alt={guide.guide_name} />
                  <h4>{guide.guide_name}</h4>
                  <div>
                    <button onClick={() => {
                      setGuideDetailsVisible(guide.guide_id);
                    }}>Details</button>
                    <button onClick={() => {
                      setSelectedGuide(guide);
                      setShowGuideModal(false);
                    }}>Select</button>
                  </div>
                  {guideDetailsVisible === guide.guide_id && (
                    <div className="guide-details-expanded">
                      <p>{guide.bio}</p>
                      <p><strong>Languages:</strong> {guide.languages_spoken}</p>
                      <p><strong>Experience:</strong> {guide.experience_years} years</p>
                      <p><strong>Rating:</strong> ⭐ {guide.rating}</p>
                    </div>
                  )}
                </div>
              )) : <p>No guides available for this location.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default BookingPage;
