import React, { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Search,Bell, Home,Settings, Users } from "lucide-react";
import { analyticsData, financialData, travelHistory, ongoingTrips } from "./admindata"; 
import './adminstyles.css'; 

// Colors for Pie Chart
const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

const Dashboard = () => {
  const [activeTrips, setActiveTrips] = useState(travelHistory); // Active trips
  const [archivedTrips, setArchivedTrips] = useState([]); // Archived trips
  const [currentOngoingTrips, setCurrentOngoingTrips] = useState(ongoingTrips); // Ongoing trips

  // Function to archive a trip manually
  const archiveTrip = (index) => {
    const tripToArchive = activeTrips[index];
    setArchivedTrips([...archivedTrips, tripToArchive]); // Add to archived trips
    setActiveTrips(activeTrips.filter((_, i) => i !== index)); // Remove from active trips
  };

  // Automatically archive completed trips
  useEffect(() => {
    const today = new Date(); // Get today's date
    const completedTrips = activeTrips.filter((trip) => {
      const returnDate = new Date(trip.return); // Convert return date to Date object
      return returnDate < today; // Check if return date is in the past
    });

    if (completedTrips.length > 0) {
      setArchivedTrips([...archivedTrips, ...completedTrips]); // Add completed trips to archive
      setActiveTrips(activeTrips.filter((trip) => !completedTrips.includes(trip))); // Remove from active trips
    }
  }, [activeTrips, archivedTrips]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item">
    <Home size={24} color="#cbd5e0" />
  </div>
  <div className="sidebar-item">
    <Bell size={24} color="#cbd5e0" />
  </div>
  <div className="sidebar-item">
    <Users size={24} color="#cbd5e0" />
  </div>
  <div className="sidebar-item">
    <Settings size={24} color="#cbd5e0" />
  </div>
  
        {/* Admin Profile Section */}
        <div className="admin-profile">
          <img src="/admin-avatar.png" alt="Admin Avatar" className="admin-avatar" />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <input type="text" className="search-input" placeholder="Search..." />
            <Search className="search-icon" />
          </div>
        </div>

        {/* Stats Cards (Side by Side) */}
        <div className="stats-cards">
          <div className="stat-card">
            <h2 className="stat-card-title">Total Profit</h2>
            <p className="stat-card-value">${financialData.totalProfit}</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-card-title">Total Revenue</h2>
            <p className="stat-card-value">${financialData.totalRevenue}</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-card-title">Total Visitors</h2>
            <p className="stat-card-value">{financialData.totalVisitors}</p>
          </div>
        </div>

        

        {/* Ongoing Trips */}
        <div className="travel-history-container">
          <h2 className="travel-history-title">Ongoing Trips</h2>
          <table className="travel-history-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Country</th>
                <th className="table-cell">Nights</th>
                <th className="table-cell">Departure</th>
                <th className="table-cell">Return</th>
                <th className="table-cell">People</th>
                <th className="table-cell">Cost</th>
                <th className="table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOngoingTrips.map((trip, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{trip.country}</td>
                  <td className="table-cell">{trip.nights}</td>
                  <td className="table-cell">{trip.departure}</td>
                  <td className="table-cell">{trip.return}</td>
                  <td className="table-cell">{trip.people}</td>
                  <td className="table-cell">{trip.cost}</td>
                  <td className="table-cell">
                    <span>Ongoing</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Archived Travel History */}
        <div className="travel-history-container">
          <h2 className="travel-history-title">Archived Trips</h2>
          <table className="travel-history-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Country</th>
                <th className="table-cell">Nights</th>
                <th className="table-cell">Departure</th>
                <th className="table-cell">Return</th>
                <th className="table-cell">People</th>
                <th className="table-cell">Cost</th>
              </tr>
            </thead>
            <tbody>
              {archivedTrips.map((trip, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{trip.country}</td>
                  <td className="table-cell">{trip.nights}</td>
                  <td className="table-cell">{trip.departure}</td>
                  <td className="table-cell">{trip.return}</td>
                  <td className="table-cell">{trip.people}</td>
                  <td className="table-cell">{trip.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Analytics (Pie Chart) */}
        <div className="pie-chart-container">
          <h2 className="pie-chart-title">Booking Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Confirmed", value: analyticsData.confirmed },
                  { name: "Pending", value: analyticsData.pending },
                  { name: "Canceled", value: analyticsData.canceled },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Graph */}
        <div className="expense-graph-container">
          <h2 className="expense-graph-title">Expenses Over 3 Years</h2>
          <p className="expense-graph-value">{financialData.expense}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[{ name: "2019", expense: 500 }, { name: "2020", expense: 700 }, { name: "2021", expense: 400 }, { name: "2022", expense: 1000 }, { name: "2023", expense: 800 }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="expense" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
