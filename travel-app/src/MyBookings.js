import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';
import Layout from './Layout';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [placeDetailsMap, setPlaceDetailsMap] = useState({});
  const [bookingSpotsMap, setBookingSpotsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to show the success message
  const [cancelledBookingId, setCancelledBookingId] = useState(null); // Store cancelled booking ID for message
  const navigate = useNavigate();
  const bookingRefs = useRef({});

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
          }));

          setPlaceDetailsMap(fetchedPlaces);
          setBookingSpotsMap(fetchedSpotsPerBooking);
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

  const toggleExpand = (bookingId) => {
    setExpandedBookingId(prev => prev === bookingId ? null : bookingId);
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



  if (loading) return <p>Loading your bookings...</p>;

  return (
    <Layout>
      <div className="MyBookings">
        <h1>My Bookings</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Success Message Box */}
        {showSuccessMessage && (
          <div className="success-message-box">
            <p>✅ Your trip has been successfully cancelled. Your money will be refunded back within 7 business days.</p>
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
                      <button
                        className="view-details-btn"
                        onClick={() => toggleExpand(booking.id)}
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            bookings.map((booking) => {
              if (booking.id === expandedBookingId) {
                const place = placeDetailsMap[booking.place_id];
                const spots = bookingSpotsMap[booking.id] || [];
                return (
                  <div key={booking.id} className="booking-details-expanded">
                    {place && (
                      <>
                        <img src={place.image} alt={place.place_name} className="place-img" />
                        <h3>{place.place_name}</h3>
                        <button
                          className="view-details-btn"
                          onClick={() => toggleExpand(null)} // Close details
                        >
                          Hide Details
                        </button>
                        <div className="booking-details">
                          <p><strong>📅 Travel Date:</strong> {booking.travel_date}</p>
                          <p><strong>💰 Total Paid:</strong> {booking.final_total}</p>
                          {spots.length > 0 && (
  <div className="spot-section">
    <h4>🗺️ Spots Included:</h4>
    <ul className="spot-list">
                    {spots.map((spot, idx) => (
                      <li key={idx} className="spot-card">
                        {spot[3] && <img src={spot[3]} alt={spot[2]} />}
                        <strong>{spot[2] || "Unnamed Spot"}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

{/* Moved Cancel Trip Button here */}
                          <button
                            className="cancel-trip-btn"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel Trip
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
