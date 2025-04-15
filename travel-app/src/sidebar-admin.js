// Sidebar.js
import React from 'react';
import { Home, Bell, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import './adminstyles.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-item"><Home size={24} color="#cbd5e0" /></div>
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

      <div className="admin-profile">
        <img src="/admin-avatar.png" alt="Admin Avatar" className="admin-avatar" />
      </div>
    </div>
  );
};

export default Sidebar;
