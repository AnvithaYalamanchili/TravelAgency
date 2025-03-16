import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaLanguage, FaUserFriends, FaBars } from "react-icons/fa";

const Sidebar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [userId, setUserId] = useState(""); // State to store user_id

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");  // Retrieve user_id from localStorage
    if (storedUserId) {
      setUserId(storedUserId);  // Set user_id in state
    }
  }, []);

  return (
    <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars className="menu-icon" onClick={toggleSidebar} style={{ color: "#e6a700" }} />
      </div>
      <ul className="sidebar-menu">
        <li>
          <FaHome style={{ color: "#e6a700" }} /> 
          {!isSidebarCollapsed && <span className="sidebar-text">Home</span>}
        </li>
        <li>
          <FaLanguage style={{ color: "#e6a700" }} /> 
          {!isSidebarCollapsed && <span className="sidebar-text">Translator</span>}
        </li>
        <li>
          <Link to={`/matched-users?user_id=${userId}`}>
            <FaUserFriends style={{ color: "#e6a700" }} /> 
            {!isSidebarCollapsed && <span className="sidebar-text">Travel Mate</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
