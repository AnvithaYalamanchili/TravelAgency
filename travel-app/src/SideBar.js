import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaLanguage, FaUserFriends, FaBars, FaUserTie } from "react-icons/fa";

const Sidebar = () => {
  const [userId, setUserId] = useState(""); // State to store user_id
  const [isSidebarHovered, setIsSidebarHovered] = useState(false); // Track hover state

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
    if (storedUserId) {
      setUserId(storedUserId); // Set user_id in state
    }
  }, []);

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
          <Link to="/lang" className="sidebar-link">
    <FaLanguage style={{ color: "#e6a700" }} />
    {isSidebarHovered && <span className="sidebar-text">Translator</span>}
  </Link>
        </li>
        <li>
          <Link to={`/matched-users?user_id=${userId}`}>
            <FaUserFriends style={{ color: "#e6a700" }} />
            {isSidebarHovered && <span className="sidebar-text">Travel Mate</span>}
          </Link>
        </li>
        <li>
          <Link to="/local-guide" className="sidebar-link">
            <FaUserTie style={{ color: "#e6a700" }} /> {/* Local Guide Icon */}
            {isSidebarHovered && <span className="sidebar-text">Local Guide</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
