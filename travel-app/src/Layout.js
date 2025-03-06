import React from "react";
import Sidebar from "./SideBar";
import { FaBell, FaUser, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom"; // For navigation links

const Layout = ({ children }) => {
  return (
    <div className="home-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="main-content">
        {/* Navbar */}
        <nav>
          <img style={{ height: '100px' }} src="/logo.png" alt="" />
          <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '100px' }}>
            <FaInfoCircle style={{ color: '#F8C923', fontSize: '30px', marginRight: '5px' }} />
            <Link to="/about" style={{ fontSize: '15px', padding: '5px 10px', whiteSpace: 'nowrap', margin: '0' }}>About Us</Link>
            <button className="book-now-btn-nav">
              Book Now
            </button>
            <FaBell style={{ color: '#F8C923', fontSize: '30px', marginLeft: '50px' }} />
          </div>

          <div className="search-div">
            <input type="text" placeholder="Search" />
            <FaUser style={{ color: '#F8C923', fontSize: '30px', marginLeft: '70px' }} />
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
