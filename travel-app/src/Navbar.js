import React, { useEffect, useState } from "react";
import { FaBell, FaUser, FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem('first_name');
    if (storedName) {
      setUserName(storedName);
    }
    console.log("User's first name from localStorage:", storedName); // Debugging line
  }, []);

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUser style={{ color: '#F8C923', fontSize: '30px', marginLeft: '70px' }} />
          {userName && <span style={{ marginLeft: '10px', color: '#F8C923' }}>{userName}</span>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
