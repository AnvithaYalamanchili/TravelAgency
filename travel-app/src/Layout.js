import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { FaBell, FaUser, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
const [userName, setUserName] = useState("");
const navigate = useNavigate();


  useEffect(() => {
    const storedName = localStorage.getItem("first_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="main-content">
        {/* Navbar */}
        <nav>
        <img style={{ height: '120px' ,backgroundColor:"transparent" }} src="./mylogo.jpeg" alt="logo" />

          <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '100px' }}>
            <FaInfoCircle style={{ color: '#F8C923', fontSize: '30px', marginRight: '5px' }} />
            <Link to="/about" style={{ fontSize: '15px', padding: '5px 10px', whiteSpace: 'nowrap', margin: '0', textDecoration: 'None' }}>About Us</Link>
            <button className="book-now-btn-nav">Book Now</button>
            <FaBell style={{ color: '#F8C923', fontSize: '30px', marginLeft: '50px' }} />
          </div>

          <div className="search-div">
            <input type="text" placeholder="Search" />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaUser style={{ color: '#F8C923', fontSize: '40px', marginLeft: '70px' }} />
              {userName && (
                <span className="welcome-message">Welcome, {userName}!</span>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
