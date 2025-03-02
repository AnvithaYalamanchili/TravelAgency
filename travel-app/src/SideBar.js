import React, { useState } from "react";
import "./Sidebar.css";
import { FaHome, FaLanguage, FaUserFriends, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars className="menu-icon" onClick={toggleSidebar} style={{color:'#e6a700'}} />
      </div>
      <ul className="sidebar-menu">
        <li>
          <FaHome  style={{color:'#e6a700'}}/> <span className="sidebar-text">Home</span>
        </li>
        <li>
          <FaLanguage style={{color:'#e6a700'}} /> <span className="sidebar-text">Translator</span>
        </li>
        <li>
          <FaUserFriends style={{color:'#e6a700'}} /> <span className="sidebar-text">Travel Mate</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
