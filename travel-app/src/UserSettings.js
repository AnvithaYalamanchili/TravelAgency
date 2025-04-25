import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './UserSettings.css';
import Layout from "./Layout";

const UserSettings = () => {
  const navigate = useNavigate();
  
  // Get current user data from localStorage
  const storedUserName = localStorage.getItem("first_name") || "";
  const storedUserId = localStorage.getItem("user_id") || "";
  
  // State for settings
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState(storedUserName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Load dark mode preference from localStorage (if set)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setMessage("Username cannot be empty!");
      return;
    }

    try {
      // Send update request to backend (example using fetch)
      const response = await fetch(`http://127.0.0.1:8000/users/${storedUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: username }),
      });

      if (!response.ok) throw new Error("Failed to update username");

      // Update localStorage
      localStorage.setItem("first_name", username);
      setMessage("Username updated successfully! ✅");
    } catch (error) {
      setMessage("Error updating username. Please try again.");
      console.error(error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // Send password update request to backend
      const response = await fetch(`http://127.0.0.1:8000/users/${storedUserId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          current_password: currentPassword,
          new_password: newPassword 
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      setMessage("Password updated successfully! ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Error updating password. Check your current password.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("first_name");
    navigate("/login");
  };

  return (
    <Layout>
    <div className={`settings-page ${darkMode ? "dark-mode" : ""}`}>
      <h1>Settings</h1>
      
      {/* Username Update */}
      <div className="settings-group">
        <h3>Update Username</h3>
        <form onSubmit={handleUpdateUsername}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="New Username"
          />
          <button type="submit">Update</button>
        </form>
      </div>

      {/* Password Update */}
      <div className="settings-group">
        <h3>Change Password</h3>
        <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>

      {/* Dark Mode Toggle */}
      

      {/* Logout Button */}
      <div className="settings-group">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Status Message */}
      {message && <p className="message">{message}</p>}

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
    </Layout>
  );
};

export default UserSettings;