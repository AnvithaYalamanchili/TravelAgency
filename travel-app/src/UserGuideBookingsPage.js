import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GuideHomePage.css"; // reuse styles
import { useNavigate } from "react-router-dom";

const UserGuideBookingsPage = () => {
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("upcoming");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/guide_bookings/user/${userId}`);
        const allBookings = res.data;

        const today = new Date();

        const enriched = await Promise.all(
          allBookings.map(async (booking) => {
            const tripEnd = new Date(booking.trip_end_date);
            if (booking.trip_status === "pending" && tripEnd < today) {
              booking.trip_status = "completed";
              await axios.put(`http://127.0.0.1:8000/guide_bookings/${booking.booking_id}`, booking);
            }

            try {
              const guideRes = await axios.get(`http://127.0.0.1:8000/guides/${booking.guide_id}`);
              return {
                ...booking,
                guide: guideRes.data,
                avatar: `https://i.pravatar.cc/150?u=guide-${booking.guide_id}`,
              };
            } catch {
              return { ...booking, guide: null };
            }
          })
        );

        setBookings(enriched);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      }
    };

    fetchBookings();
  }, [userId, navigate]);

  const filteredBookings = bookings.filter((b) =>
    view === "upcoming" ? b.trip_status === "pending" : b.trip_status === "completed"
  );

  return (
    <div className="guide-home-container">
      <header className="navbar">
        <img src="/logo.jpg" alt="logo" className="navbar-logo" />
        <h2>Local Guide Trips</h2>
      </header>

      <div className="nav-tabs">
        <button onClick={() => setView("upcoming")} className={view === "upcoming" ? "active" : ""}>Upcoming Guide Bookings</button>
        <button onClick={() => setView("history")} className={view === "history" ? "active" : ""}>Guides History</button>
      </div>

      <div className="bookings-grid">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">No {view} guide trips found.</div>
        ) : (
          filteredBookings.map((booking, index) => (
            <div key={index} className="booking-card">
              <div className="booking-header">
                <img src={booking.avatar} alt="Guide Avatar" className="user-avatar" />
                <h4>{booking.guide?.first_name} {booking.guide?.last_name}</h4>
              </div>
              <div className="booking-details">
              <p><strong>Trip Start:</strong> {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  })}</p>

                  <p><strong>Trip End:</strong> {new Date(booking.trip_end_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  })}</p>
              </div>
              
              {view === "upcoming" && (
                <button 
                  className="card-btn" 
                  onClick={() => navigate(`/guidechat/${userId}/${booking.guide_id}`)}
                >
                  Chat with Guide
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserGuideBookingsPage;
