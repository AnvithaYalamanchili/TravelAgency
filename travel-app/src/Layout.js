import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { FaBell, FaUser, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './Layout.css';

const Layout = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [likedTrips, setLikedTrips] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get data from localStorage when the component mounts
    const storedUserId = localStorage.getItem("user_id");
    const storedUserName = localStorage.getItem("first_name");
    const storedLikedTrips = JSON.parse(localStorage.getItem("likedTrips") || "[]");

    if (storedUserId) {
      setUserId(storedUserId); // Set the user_id
    }

    if (storedUserName) {
      setUserName(storedUserName); // Set the first_name
    }

    if (storedLikedTrips) {
      setLikedTrips(storedLikedTrips); // Set the likedTrips
    }
  }, []);

  const handleLogout = () => {
    // Remove user-specific data from localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("first_name");

    // Redirect to login page
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-icon-container")) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="home-container">
      <Sidebar />

      <div className="main-content">
        <nav>
          <img
            style={{ height: '120px', backgroundColor: "transparent" }}
            src="./logo.png"
            alt="logo"
          />
          <FaInfoCircle />
          <Link
            to="/about"
            style={{
              fontSize: '13px',
              padding: '0 8px',
              textDecoration: 'none',
              marginLeft: '-50px'
            }}
          >
            About Us
          </Link>

          <Link>My Bookings</Link>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-50px' }}>
            <button className="book-now-btn-nav">Explore</button>
          </div>



          <div className="search-div">
            <input type="text" placeholder="Search" />
            <FaBell />

            {/* User Icon + Dropdown */}
            <div className="user-icon-container" style={{ position: 'relative', marginLeft: '50px' }}>
              <FaUser
                style={{ color: '#F8C923', fontSize: '30px', cursor: 'pointer' }}
                onClick={() => setShowUserDropdown(prev => !prev)}
              />
              {showUserDropdown && (
                <div className="user-dropdown">
                  <p className="dropdown-name">Welcome, {userName}!</p>
                  <hr />
                  <button className="dropdown-btn" onClick={() => navigate("/profile")}>Profile</button>
                  <button className="dropdown-btn" onClick={() => navigate("/settings")}>Settings</button>
                  <button className="dropdown-btn logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
};

export default Layout;
