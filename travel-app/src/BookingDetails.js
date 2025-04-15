import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MyBookings.css';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [place, setPlace] = useState(null);
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // ✅ Get user data (JWT or localStorage)
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.user_id) {
          setError("User not authenticated.");
          return;
        }

        const userId = userData.user_id;

        // ✅ Get all bookings for user
        const userBookingsRes = await fetch(`http://127.0.0.1:8000/bookings/${userId}`);
        const userBookingsData = await userBookingsRes.json();

        if (!userBookingsRes.ok) {
          setError("Failed to fetch user bookings.");
          return;
        }

        const selectedBooking = userBookingsData.bookings.find(
          (b) => b.id.toString() === id
        );

        if (!selectedBooking) {
          setError("Booking not found.");
          return;
        }

        setBooking(selectedBooking);

        const placeId = selectedBooking.place_id;
        if (!placeId) {
          setError("Place ID not found in booking.");
          return;
        }

        const placeRes = await fetch(`http://127.0.0.1:8000/place/${placeId}`);
        const placeData = await placeRes.json();
        setPlace(placeData);

        const spotsRes = await fetch(`http://127.0.0.1:8000/bookings/${id}/spots`);
        const spotsData = await spotsRes.json();
        setSpots(spotsData.spots || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      }
    };

    fetchDetails();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!booking || !place) return <p>Loading booking details...</p>;

  return (
    <div className="booking-container">
      <div className="booking-card">
        <img src={place.image} alt={place.place_name} className="place-image" />
        <div className="booking-header">Trip to {place.place_name}</div>

        <div className="booking-details active">
          <h4>Booking ID: {booking.id}</h4>
          <p>📅 Travel Date: {booking.travel_date}</p>
          <p>👥 Travelers: {booking.travelers}</p>
          <p>💰 Final Total: ₹{booking.final_total}</p>
          <p>📞 Phone: {booking.phone}</p>
          <p>✉️ Email: {booking.email}</p>

          {spots.length > 0 && (
            <div>
              <h4>🗺️ Spots Included:</h4>
              <ul>
                {spots.map((spot, idx) => (
                  <li key={idx}>
                    <strong>{spot[2] || "Unnamed Spot"}</strong>
                    {spot[3] && (
                      <div>
                        <img
                          src={spot[3]}
                          alt={spot[2]}
                          style={{ width: '100px', height: 'auto', marginTop: '5px' }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            ← Back to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
