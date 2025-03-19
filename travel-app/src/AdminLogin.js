import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './LoginPage.css'; 

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    let formErrors = {};
  
    if (!username.trim()) formErrors.username = "Username is required";
    if (!password.trim()) formErrors.password = "Password is required";
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const adminUsername = "admin";
  const adminPassword = "Admin@123";
   if (username === adminUsername && password === adminPassword) {

    localStorage.setItem("admin_authenticated", "true");

    navigate("/admin-dashboard"); 
  } else {
    alert("Login Failed! Incorrect username or password.");
  }
}; 

  return (
    <div className="login-page-background">
      <div className="login-container">
        <h2 className='login'>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button className="submit-btn" type="submit">Login</button>
        </form>

        
      </div>
    </div>
  );
};

export default AdminLoginPage;
