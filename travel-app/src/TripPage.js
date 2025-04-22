import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { FaHome, FaMapMarkerAlt, FaClock, FaBus, FaHotel, FaUtensils, FaCheckCircle } from "react-icons/fa";
import { GiMoneyStack, GiEarthAmerica } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import "./TripPage.css";
import Layout from "./Layout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// Define currency symbols
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
        
        const imagesArray = data.explore_images 
          ? data.explore_images.split(',').map(img => img.trim()) 
          : [];
        
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

    // Add this function to your component
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
    if (selectedCurrency === "USD") return usdPrice.toFixed(2);
    return (usdPrice * (rates[selectedCurrency] || 1)).toFixed(2);
  };

  const toggleSpotSelection = async (spot) => {
  let updatedSelectedSpots;
  
  // If spot is already selected, remove it
  if (selectedSpots.some((s) => s.spot_id === spot.spot_id)) {
    updatedSelectedSpots = selectedSpots.filter((s) => s.spot_id !== spot.spot_id);
  } 
  // If spot is being added
  else {
    // Geocode the location first
    const coordinates = await geocodeLocation(spot.spot_name);
    
    updatedSelectedSpots = [
      ...selectedSpots, 
      {
        ...spot,
        coordinates // Add the geocoded coordinates
      }
    ];
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

  const geocodeLocation = async (locationName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};


  if (!trip) return <div className="loading-screen">Loading trip details...</div>;

  return (
    <Layout>
      <div className="trip-page-container">
        {/* Hero Section */}
        <div className="trip-hero">
          <Swiper 
            modules={[Navigation, Autoplay, EffectFade]} 
            effect="fade"
            navigation 
            autoplay={{ delay: 5000 }} 
            speed={1000}
            loop={true}
            className="hero-swiper"
          >
            {trip.images.length > 0 ? (
              trip.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div 
                    className="hero-image"
                    style={{ 
                      backgroundImage: `url(${image})` 
                    }}
                  >
                    <div className="hero-overlay">
                      <h1>Discover {trip.place_name}</h1>
                      <p>{trip.short_description || "An unforgettable journey awaits you"}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="hero-image placeholder-image">
                  <div className="hero-overlay">
                    <h1>Discover {trip.place_name}</h1>
                    <p>An unforgettable journey awaits you</p>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Currency Selector */}
        <div className="currency-selector-container">
          <div className="currency-selector">
            <GiEarthAmerica className="currency-icon" />
            <select 
              onChange={(e) => setSelectedCurrency(e.target.value)} 
              value={selectedCurrency}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="trip-content">
          {/* Tour Overview Section */}
          <section className="tour-overview-section">
            <div className="section-header">
              <h2>Tour Overview</h2>
              <div className="header-decoration"></div>
            </div>
            <p className="tour-description">{trip.description}</p>
            
            <div className="tour-highlights">
              <div className="highlight-card">
                <FaClock className="highlight-icon" />
                <div>
                  <h4>Duration</h4>
                  <p>{trip.duration}</p>
                </div>
              </div>
              <div className="highlight-card">
                <FaBus className="highlight-icon" />
                <div>
                  <h4>Transportation</h4>
                  <p>{trip.transportation}</p>
                </div>
              </div>
              <div className="highlight-card">
                <FaHotel className="highlight-icon" />
                <div>
                  <h4>Accommodation</h4>
                  <p>{trip.accommodation}</p>
                </div>
              </div>
              <div className="highlight-card">
                <FaUtensils className="highlight-icon" />
                <div>
                  <h4>Meals</h4>
                  <p>{trip.meals}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Attractions Section */}
          <section className="attractions-section">
            <div className="section-header">
              <h2>Customize Your Experience</h2>
              <div className="header-decoration"></div>
              <p className="selection-counter">
                {selectedSpots.length} of {Math.max(4, selectedSpots.length)} selected
                <span className="counter-badge">{selectedSpots.length}</span>
              </p>
            </div>
            
            <div className="attractions-grid">
              {defaultPlaces.length > 0 ? (
                defaultPlaces.map((place) => (
                  <div 
                    key={place.spot_id} 
                    className={`attraction-card ${selectedSpots.some(s => s.spot_id === place.spot_id) ? "selected" : ""}`}
                    onClick={() => toggleSpotSelection(place)}
                  >
                    <div 
                      className="attraction-image" 
                      style={{ backgroundImage: `url(${place.image})` }}
                    >
                      {selectedSpots.some(s => s.spot_id === place.spot_id) && (
                        <div className="selected-badge">
                          <FaCheckCircle />
                        </div>
                      )}
                    </div>
                    <div className="attraction-info">
                      <h4>{place.spot_name}</h4>
                      <p className="attraction-price">
                        {currencySymbols[selectedCurrency]}{convertPrice(place.price)}
                      </p>
                      <p className="attraction-description">
                        {place.description || "Explore this amazing location"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="loading-spots">
                  <div className="loading-spinner"></div>
                  <p>Loading amazing experiences...</p>
                </div>
              )}
            </div>
          </section>

          {/* Map Section */}
          {/* Map Section */}

    <div className="map-booking-wrapper">
<section className="map-section">
  <h3>Selected Locations</h3>
  <div className="map-container">
    {selectedSpots.length > 0 ? (
      <MapContainer 
        center={selectedSpots[0].coordinates || [20.5937, 78.9629]} 
        zoom={selectedSpots.length === 1 ? 12 : 6}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          // Fix for map rendering issues
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedSpots.map(spot => (
          spot.coordinates && (
            <Marker
              key={spot.spot_id}
              position={[spot.coordinates.lat, spot.coordinates.lng]}
              icon={new Icon({
                iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
                iconSize: [25, 25],
                iconAnchor: [12, 25],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <h4>{spot.spot_name}</h4>
                <p>{spot.description || "Selected location"}</p>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    ) : (
      <div className="map-placeholder">
        <p>Select spots to see their locations</p>
      </div>
    )}
  </div>
</section>

          {/* Booking Section */}
          <section className="booking-section">
            <div className="booking-card">
              <h3>Your Customized Package</h3>
              
              {selectedSpots.length > 0 ? (
                <div className="selected-spots-list">
                  <h4>Selected Experiences:</h4>
                  <ul>
                    {selectedSpots.map((spot) => (
                      <li key={spot.spot_id}>
                        <FaMapMarkerAlt className="spot-marker" />
                        <span>{spot.spot_name}</span>
                        <span className="spot-price">
                          {currencySymbols[selectedCurrency]}{convertPrice(spot.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="empty-selection">
                  <p>Select at least 4 attractions to continue</p>
                </div>
              )}
              
              <div className="total-price">
                <div className="price-display">
                  <span>Total per person:</span>
                  <span className="amount">
                    {currencySymbols[selectedCurrency]}{convertPrice(totalAmount)}
                  </span>
                </div>
                <button 
                  className={`book-now-btn ${selectedSpots.length >= 4 ? 'active' : 'disabled'}`}
                  onClick={handleCheckAvailability}
                >
                  {selectedSpots.length >= 4 ? (
                    <>
                      Book Now <IoIosArrowForward className="btn-arrow" />
                    </>
                  ) : (
                    `Select ${4 - selectedSpots.length} more`
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default TripPage;
