import React, { useState } from 'react';
import { Home, Bell, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);

  const handleAvatarClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    // Example logout logic
    localStorage.removeItem('token');
    window.location.href = '/login'; // or use navigate() from react-router
  };

  return (
    <div className="sidebar relative">
      <div className="sidebar-item">
        <Link to="/admin-dashboard">
          <Home size={24} color="#cbd5e0" />
        </Link>
      </div>
      <div className="sidebar-item"><Bell size={24} color="#cbd5e0" /></div>
      <div className="sidebar-item">
        <Link to="/users">
          <Users size={24} color="#cbd5e0" />
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/settings">
          <Settings size={24} color="#cbd5e0" />
        </Link>
      </div>

      <div className="admin-profile relative">
        <img
          src="/admin-avatar.png"
          alt="Admin Avatar"
          className="admin-avatar cursor-pointer"
          onClick={handleAvatarClick}
        />

        {showLogout && (
          <button
            onClick={handleLogout}
            className="absolute top-12 left-1/2 -translate-x-1/2 mt-2 bg-red-500 text-white px-3 py-1 rounded shadow-lg text-sm z-50"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
