// Navbar.js
import React from "react";
import { FaBell, FaUser, FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav>
      <img style={{ height: '100px' }} src="./logo.png" alt="logo" />
      <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '100px' }}>
        <FaInfoCircle style={{ color: '#F8C923', fontSize: '30px', marginRight: '5px' }} />
        <p style={{ fontSize: '15px', padding: '5px 10px', whiteSpace: 'nowrap', margin: '0' }}>About Us</p>
        <button className="book-now-btn-nav">Book Now</button>
        <FaBell style={{ color: '#F8C923', fontSize: '30px', marginLeft: '50px' }} />
      </div>

      <div className="search-div">
        <input type="text" placeholder="Search" />
        <FaUser style={{ color: '#F8C923', fontSize: '30px', marginLeft: '70px' }} />
      </div>
    </nav>
  );
};

export default Navbar;
