import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GuideHomePage.css";
import { useNavigate } from "react-router-dom";

const GuideHomePage = () => {
  const guideId = localStorage.getItem("guide_id");
  const fullName = localStorage.getItem("guide_name") || "Guide";
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("upcoming"); // 'upcoming' | 'history' | 'earnings'
  const [earnings, setEarnings] = useState({ completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!guideId) {
      navigate("/guide-login");
      return;
    }
  
    const fetchAndUpdateBookings = async () => {
      setIsLoading(true); // Set loading to true when starting to fetch data
      try {
        const res = await axios.get(`http://127.0.0.1:8000/guide_bookings/${guideId}`);
        const allBookings = res.data;
  
        let completedTotal = 0;
        let pendingTotal = 0;
  
        const today = new Date();
  
        const enriched = await Promise.all(
          allBookings.map(async (booking) => {
            // Check if trip has ended and still marked pending
            const tripEnd = new Date(booking.trip_end_date);
            if (booking.trip_status === "pending" && tripEnd < today) {
              // Update trip_status to "completed"
              booking.trip_status = "completed";
              await axios.put(`http://127.0.0.1:8000/guide_bookings/${booking.booking_id}`, booking);
            }
  
            if (booking.trip_status === "completed") completedTotal += booking.payment;
            if (booking.trip_status === "pending") pendingTotal += booking.payment;
  
            try {
              const userRes = await axios.get(`http://127.0.0.1:8000/user/${booking.user_id}`);
              return {
                ...booking,
                user: userRes.data,
                avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${booking.user_id}`
              };
            } catch {
              return { ...booking, user: null };
            }
          })
        );
  
        setEarnings({ completed: completedTotal, pending: pendingTotal });
        setBookings(enriched);
      } catch (err) {
        console.error("Error fetching or updating guide bookings:", err);
      } finally {
        setIsLoading(false); // Set loading to false when done (whether successful or not)
      }
    };
  
    fetchAndUpdateBookings();
  }, [guideId, navigate]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/guide-login");
  };

  const filteredBookings = bookings.filter((booking) => {
    if (view === "upcoming") return booking.trip_status === "pending";
    if (view === "history") return booking.trip_status === "completed";
    return false;
  });

  return (
    <div className="guide-home-container">
      {/* Top Navbar */}
      <header className="navbar">
        <img style={{height:"110px"}} src="/logo.png" alt="logo" className="navbar-logo" />
        <input type="text" className="search-bar" placeholder="Search" />
        <div className="navbar-user">
          <span>Welcome, {fullName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="nav-tabs">
        <button onClick={() => setView("upcoming")} className={view === "upcoming" ? "active" : ""}>Upcoming Schedules</button>
        <button onClick={() => setView("history")} className={view === "history" ? "active" : ""}>Trips History</button>
        <button onClick={() => setView("earnings")} className={view === "earnings" ? "active" : ""}>Earnings Overview</button>
      </div>

      {/* Loading indicator */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        /* Content Based on View */
        view === "earnings" ? (
          <div className="earnings-section">
            <h2>Earnings Overview</h2>
            <p><strong>Total Earnings (Completed Trips):</strong> ${earnings.completed}</p>
            <p><strong>Upcoming Earnings (Pending Trips):</strong> ${earnings.pending}</p>
          </div>
        ) : (
            <div className="bookings-grid">
              {filteredBookings.length === 0 ? (
                <div className="no-bookings">No {view} bookings found.</div>
              ) : (
                filteredBookings.map((booking, index) => (
                  <div key={index} className="booking-card">
                      <div className="booking-header">
                        <img src={booking.avatar} alt="User Avatar" className="user-avatar" />
                        <h4>{booking.user?.first_name} {booking.user?.last_name}</h4>
                      </div>

                    <div className="booking-details">
                    <p><strong>Trip Date:</strong> {new Date(booking.booking_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>

                    
                    </div>
                    {view === "upcoming" && (
                      <button 
                        className="card-btn" 
                        onClick={() => navigate(`/guidechat/${guideId}/${booking.user_id}`)}
                      >
                        Start Chat
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
        )
      )}
    </div>
  );
};

export default GuideHomePage;