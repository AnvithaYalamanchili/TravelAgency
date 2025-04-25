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
  const [searchQuery, setSearchQuery] = useState("");

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

 const handleSearch = async (e) => {
  e.preventDefault();
  const query = searchQuery.trim();
  if (query === "") return;
  navigate(`/search?q=${encodeURIComponent(query)}`);
  try {
    const response = await fetch(`http://127.0.0.1:8000/places/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) throw new Error("Search failed");
    
    const data = await response.json();
    
    if (data.place_id) {
      // Navigate to place details page with the place_id
      navigate(`/places/${data.place_id}`);
    } else if (data.suggestions && data.suggestions.length > 0) {
      // If no exact match but have suggestions, navigate to search results
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      // No results found
        
    }
  } catch (error) {
    console.error("Search error:", error);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }
};


  return (
    <div className="home-container">
      <Sidebar />

      <div className="main-content">
        <nav>
          <img
            style={{ height: '120px', backgroundColor: "transparent" }}
            src="./mylogo.jpeg"
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

          <Link to="/my-bookings" style={{ marginLeft: '-50px' }}>
            My Bookings
          </Link>


          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-50px' }}>
           <button className="book-now-btn-nav" onClick={() => navigate("/explore")}>
  Explore
</button>

<form onSubmit={handleSearch} style={{ marginLeft: "20px", display: "flex", alignItems: "center" }}>
  <input
    type="text"
    placeholder="Search trips..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="navbar-search-input"
  />
  <button type="submit" className="navbar-search-btn">Search</button>
</form>


          </div>

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
        </nav>

        {children}
      </div>
    </div>
  );
};

export default Layout;
