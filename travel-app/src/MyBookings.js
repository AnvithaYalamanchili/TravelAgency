import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';
import Layout from './Layout';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [placeDetailsMap, setPlaceDetailsMap] = useState({});
  const [bookingSpotsMap, setBookingSpotsMap] = useState({});
  const [suggestionsMap, setSuggestionsMap] = useState({});
  const [suggestionsLoadingMap, setSuggestionsLoadingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [cancelledBookingId, setCancelledBookingId] = useState(null);
  const [hotelBookingSuccess, setHotelBookingSuccess] = useState(null);
  const [selectedHotels, setSelectedHotels] = useState({});
  const [hotelNamesMap, setHotelNamesMap] = useState({});
  const [focusedBookingId, setFocusedBookingId] = useState(null);
  const [expandedSpotsMap, setExpandedSpotsMap] = useState({});



  const navigate = useNavigate();
  const hotelSectionRef = useRef({});

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("Please log in to see your bookings");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/bookings/${userId}`);
        const data = await response.json();

        if (response.ok) {
          const bookingsData = data.bookings || [];
          setBookings(bookingsData);

          const fetchedPlaces = {};
          const fetchedSpotsPerBooking = {};
          const fetchedHotelNames = {};

          await Promise.all(bookingsData.map(async (booking) => {
            const placeId = booking.place_id;

            if (!fetchedPlaces[placeId]) {
              const placeRes = await fetch(`http://127.0.0.1:8000/place/${placeId}`);
              if (placeRes.ok) {
                const placeData = await placeRes.json();
                fetchedPlaces[placeId] = placeData;
              }
            }

            const spotsRes = await fetch(`http://127.0.0.1:8000/bookings/${booking.id}/spots`);
            if (spotsRes.ok) {
              const spotsData = await spotsRes.json();
              fetchedSpotsPerBooking[booking.id] = spotsData.spots || [];
            }

            const hotelRes = await fetch(`http://127.0.0.1:8000/bookings/${booking.id}/hotel`);
            if (hotelRes.ok) {
              const hotelData = await hotelRes.json();
              fetchedHotelNames[booking.id] = hotelData.hotel_name || null;
            }
          }));

          setPlaceDetailsMap(fetchedPlaces);
          setBookingSpotsMap(fetchedSpotsPerBooking);
          setHotelNamesMap(fetchedHotelNames);
        } else {
          setError(data.message || "Error fetching bookings");
        }
      } catch (error) {
        setError("Error fetching bookings.");
      }

      setLoading(false);
    };

    fetchBookings();
  }, [navigate]);

  const fetchSuggestions = async (bookingId) => {
    try {
      setSuggestionsLoadingMap(prev => ({ ...prev, [bookingId]: true }));
      const response = await fetch(`http://127.0.0.1:8000/suggestions/${bookingId}`);
      const data = await response.json();

      if (response.ok) {
        setSuggestionsMap(prev => ({
          ...prev,
          [bookingId]: data || []
        }));
      }
    } catch (err) {
      console.error("Error fetching suggestions", err);
    } finally {
      setSuggestionsLoadingMap(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const toggleHotelSection = (bookingId) => {
    setFocusedBookingId(bookingId);
    if (hotelSectionRef.current[bookingId]) {
      hotelSectionRef.current[bookingId].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const toggleExpand = (bookingId) => {
    if (expandedBookingId !== bookingId) {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && !suggestionsMap[bookingId]) {
        fetchSuggestions(bookingId);
      }
    }
    setExpandedBookingId(prev => (prev === bookingId ? null : bookingId));
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev =>
          prev.filter(booking => String(booking.id) !== String(bookingId))
        );

        if (expandedBookingId === bookingId) {
          setExpandedBookingId(null);
        }

        setCancelledBookingId(bookingId);
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
          setCancelledBookingId(null);
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.message || "Error cancelling booking");
      }
    } catch (error) {
      setError("Error cancelling booking.");
    }
  };

  const bookHotel = async (bookingId, hotelName) => {
    try {
      const checkResponse = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}/hotel`);
      const checkData = await checkResponse.json();

      let response;

      if (checkData.hotel_name) {
        response = await fetch(`http://127.0.0.1:8000/update-hotel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_id: bookingId, hotel_name: hotelName }),
        });
      } else {
        response = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}/hotel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotel_name: hotelName }),
        });
      }

      if (response.ok) {
        setHotelBookingSuccess(`Hotel "${hotelName}" booked successfully!`);
        setTimeout(() => setHotelBookingSuccess(null), 5000);

        setHotelNamesMap(prev => ({
          ...prev,
          [bookingId]: hotelName,
        }));

        setSelectedHotels(prev => ({
          ...prev,
          [bookingId]: null,
        }));
      } else {
        const data = await response.json();
        alert(`Error booking hotel: ${data.message}`);
      }
    } catch (err) {
      alert("Error booking hotel.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <Layout>
      <div className="MyBookings">
        <h1>My Bookings</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {showSuccessMessage && (
          <div className="success-message-box">
            <p>✅ Your trip has been successfully cancelled. Your money will be refunded within 7 business days.</p>
          </div>
        )}

        {hotelBookingSuccess && (
          <div className="hotel-booking-success-box">
            <p>{hotelBookingSuccess}</p>
          </div>
        )}

        <div className="booking-grid">
          {expandedBookingId === null ? (
            bookings.map((booking) => {
              const place = placeDetailsMap[booking.place_id];
              return (
                <div key={booking.id} className="booking-card">
                  {place && (
                    <>
                      <img src={place.image} alt={place.place_name} className="place-img" />
                      <h3>{place.place_name}</h3>
                      <button className="view-details-btn" onClick={() => toggleExpand(booking.id)}>
                        View Details
                      </button>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            bookings.map((booking) => {
              if (booking.id !== expandedBookingId) return null;

              const place = placeDetailsMap[booking.place_id];
              const spots = bookingSpotsMap[booking.id] || [];
              const suggestions = suggestionsMap[booking.id] || [];
              const isLoadingSuggestions = suggestionsLoadingMap[booking.id];

              return (
                <div key={booking.id} className="booking-details-expanded">
                  {place && (
                    <>
                      <img src={place.image} alt={place.place_name} className="place-img" />
                      <h3 style={{textAlign:"center"}}>{place.place_name}</h3>
                      <button className="view-details-btn" onClick={() => toggleExpand(null)}>
                        Hide Details
                      </button>
                      <div className="booking-details">
                        <p><strong>📅 Travel Date:</strong> {booking.travel_date}</p>
                        <p><strong>💰 Total Paid:</strong> {booking.final_total}</p>

                        {hotelNamesMap[booking.id] && (
                          <p>
                            <strong>🏨 Selected Hotel:</strong> {hotelNamesMap[booking.id]}{' '}
                            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => toggleHotelSection(booking.id)}>
                              Change Hotel
                            </span>
                          </p>
                        )}

                        {spots.length > 0 && (
                          <div className="spot-section">
                            <h4>🗺️ Spots Included:</h4>
                            <ul className="spot-list">
  {spots.map((spot, idx) => {
  const spotId = `${booking.id}-${idx}`;
  const isExpanded = expandedSpotsMap[spotId] || false;

  const toggleSpot = () => {
    setExpandedSpotsMap(prev => ({
      ...prev,
      [spotId]: !isExpanded
    }));
  };

  const packingItems = 
    Array.isArray(spot[10]) ? spot[10]
    : spot[10]?.startsWith("[") ? JSON.parse(spot[10])
    : spot[10]?.split(",") || [];

  return (
    <li key={spotId} className="spot-card">
      <div onClick={toggleSpot} style={{ cursor: 'pointer' }}>
        {spot[3] && <img src={spot[3]} alt={spot[2]} />}
        <strong style={{textAlign:"center"}}>{spot[2] || "Unnamed Spot"}</strong>
        {isExpanded && (
          <div className="packing-list-section">
            <h5>🧳 Packing List:</h5>
            <ul>
              {packingItems.map((item, itemIdx) => (
                <li key={itemIdx}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
})}
</ul>



                          </div>
                        )}

                        <h4>🌟 Personalized Suggestions</h4>
                        {isLoadingSuggestions ? (
                          <p>Loading suggestions...</p>
                        ) : suggestions.length > 0 ? (
                          <ul className="suggestion-list">
                            {suggestions.map((s, idx) => (
                              <li key={idx} className="suggestion-card">
                                {s.image && <img src={s.image} alt={s.name} className="suggestion-image" />}
                                <div>
                                  <strong style={{textAlign:"center"}}>{s.name}</strong>
                                  <p>{s.description}</p>
                                  <p><em>Type: {s.type}</em></p>
                                  <p>Rating ⭐: {s.rating}</p>
                                  <p>Best time to visit: 🕒 {s.hours}</p>
                                  <p><strong>Event:</strong> {s.local_event}</p>
                                  <p><strong>Weather:</strong> {s.weather_conditions}</p>

                                  {s.activities && s.activities.length > 0 && (
                                    <div>
                                      <h5>🎯 Recommended Activities:</h5>
                                      <ul>
                                        {s.activities.map((a, i) => <li key={i}>{a}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                  {s.hotels && s.hotels.length > 0 && (
                                    <div ref={(el) => (hotelSectionRef.current[booking.id] = el)} className="hotel-section">
                                      <h5>🏨 Hotels</h5>
                                      <ul>
                                        {s.hotels.map((h, i) => {
                                          const selected = selectedHotels[booking.id] === h.name;
                                          const isBookedHotel = h.name === hotelNamesMap[booking.id];
                                          if (isBookedHotel) return null;
                                          return (
                                            <li key={i}>
                                              <div>
                                                <input
                                                  type="radio"
                                                  name={`selectedHotel-${booking.id}`}
                                                  checked={selected}
                                                  onChange={() =>
                                                    setSelectedHotels(prev => ({ ...prev, [booking.id]: h.name }))
                                                  }
                                                />
                                                <strong>{h.name}</strong>
                                                {h.contact_number && <p>📞 {h.contact_number}</p>}
                                                {selected && (
                                                  <button onClick={() => bookHotel(booking.id, h.name)}>
                                                    🏨 Book Hotel
                                                  </button>
                                                )}
                                              </div>
                                              {h.image && <img src={h.image} alt={h.name} />}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No suggestions available.</p>
                        )}

                        <button className="write-review-btn" onClick={() => navigate(`/write-review/${booking.id}`)}>
                          ✍️ Write a Review
                        </button>

                        <button className="cancel-trip-btn" onClick={() => cancelBooking(booking.id)}>
                          ❌ Cancel Trip
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
