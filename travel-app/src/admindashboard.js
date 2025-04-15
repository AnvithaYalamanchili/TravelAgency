import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Search, Bell, Home, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";  // Import Link
import axios from "axios";
import { analyticsData, financialData, travelHistory, ongoingTrips } from "./admindata";
import './adminstyles.css';
import Sidebar from "./AdminSidebar";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

const Dashboard = () => {
  const [activeTrips, setActiveTrips] = useState(travelHistory);
  const [archivedTrips, setArchivedTrips] = useState([]);
  const [currentOngoingTrips, setCurrentOngoingTrips] = useState(ongoingTrips);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for bookings
  const [error, setError] = useState(null); // Error state for bookings

  // Archive a trip
  const archiveTrip = (index) => {
    const tripToArchive = activeTrips[index];
    setArchivedTrips([...archivedTrips, tripToArchive]);
    setActiveTrips(activeTrips.filter((_, i) => i !== index));
  };

  // Handle trip archiving based on return date
  useEffect(() => {
    const today = new Date();
    const completedTrips = activeTrips.filter((trip) => {
      const returnDate = new Date(trip.return);
      return returnDate < today;
    });

    if (completedTrips.length > 0) {
      setArchivedTrips([...archivedTrips, ...completedTrips]);
      setActiveTrips(activeTrips.filter((trip) => !completedTrips.includes(trip)));
    }
  }, [activeTrips, archivedTrips]);

  // Fetch bookings from API
  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/bookings");
      console.log(response.data);  // Log the API response to inspect the structure
      if (response.data.status === "success") {
        setBookings(response.data.bookings);
      } else {
        setError("Failed to load bookings");
      }
    } catch (error) {
      setError("Error fetching bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchBookings();
}, []);


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <input type="text" className="search-input" placeholder="Search..." />
            <Search className="search-icon" />
          </div>
        </div>

        {/* Stats Cards */}
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

        <div className="travel-history-container">
            <h2 className="travel-history-title">All Bookings</h2>
            {loading ? (
              <div>Loading bookings...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <table className="travel-history-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Booking ID</th>
                    <th className="table-cell">Full Name</th>
                    <th className="table-cell">Date</th>
                    <th className="table-cell">Passengers</th>
                    <th className="table-cell">Spots</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{booking.id}</td> {/* Correct field name */}
                      <td className="table-cell">{booking.full_name}</td> {/* Correct field name */}
                      <td className="table-cell">{booking.travel_date}</td> {/* Correct field name */}
                      <td className="table-cell">{booking.passengers}</td>
                      <td className="table-cell">{booking.spots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                  <td className="table-cell"><span>Ongoing</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Archived Trips */}
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

        {/* Booking Analytics */}
        <div className="pie-chart-container">
          <h2 className="pie-chart-title">Booking Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[{ name: "Confirmed", value: analyticsData.confirmed }, { name: "Pending", value: analyticsData.pending }, { name: "Canceled", value: analyticsData.canceled }] }
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

        {/* All Bookings */}
        
      </div>
    </div>
  );
};

export default Dashboard;
