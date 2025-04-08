import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { 
  FaHome, 
  FaLanguage, 
  FaUserFriends, 
  FaMapMarkerAlt,
  FaBars, 
  FaUserTie, 
  FaComments,
  FaBell 
} from "react-icons/fa";

const Sidebar = () => {
  const [userId, setUserId] = useState(""); // State to store user_id
  const [isSidebarHovered, setIsSidebarHovered] = useState(false); // Track hover state
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); // Track pending requests

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
    if (storedUserId) {
      setUserId(storedUserId); // Set user_id in state
      fetchPendingRequestsCount(storedUserId); // Fetch pending requests count
    }
  }, []);

  const fetchPendingRequestsCount = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/interest-requests/received/${userId}`
      );
      const data = await response.json();
      setPendingRequestsCount(data.requests?.length || 0);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  return (
    <div
      className={`sidebar ${isSidebarHovered ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsSidebarHovered(true)} // Expand when hover starts
      onMouseLeave={() => setIsSidebarHovered(false)} // Collapse when hover ends
    >
      <div className="sidebar-header">
        <FaBars className="menu-icon" style={{ color: "#e6a700" }} />
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/home" className="sidebar-link">
            <FaHome style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/translator" className="sidebar-link">
            <Link to="/lang" className="sidebar-link">
    <FaLanguage style={{ color: "#e6a700" }} />
      {isSidebarHovered && <span className="sidebar-text">Translator</span>}
          </Link>
  </Link>
        </li>
        <li>
          <Link to={`/matched-users?user_id=${userId}`} className="sidebar-link">
            <FaUserFriends style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Travel Mate</span>}
          </Link>
        </li>

        {/* New Matched Places Option */}
        <li>
          <Link to="/Locations" className="sidebar-link">
            <FaMapMarkerAlt style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Matched Places</span>}
          </Link>
        </li>

        <li>
          <Link to="/local-guide" className="sidebar-link">
            <FaUserTie style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Local Guide</span>}
          </Link>
        </li>
        <li>
          <Link to={`/chat/${userId}`} className="sidebar-link">
            <FaComments style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Chat</span>}
          </Link>
        </li>
        <li>
          <Link to="/interest-requests" className="sidebar-link">
            <div className="notification-container">
              <FaBell style={{ color: "#e6a700" }} />
              {pendingRequestsCount > 0 && (
                <span className="notification-badge">{pendingRequestsCount}</span>
              )}
            </div>
            {isSidebarHovered && <span className="sidebar-text">Requests</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;