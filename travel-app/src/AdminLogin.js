import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use 'useNavigate' hook for navigation
import './LoginPage.css'; 

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize 'useNavigate' hook for navigation

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
  
    try {
      // Send the login request with username and password
      const response = await axios.post('http://127.0.0.1:8000/admin/login', { username, password });
      alert('Login Successful!');
  
      // Assuming the response contains the admin_id
      const admin_id = response.data.admin_id; // Modify backend to return admin_id
      localStorage.setItem('admin_id', admin_id); // Store admin_id in local storage
      console.log("Admin ID stored in localStorage: ", localStorage.getItem('admin_id'));
  
      // Redirect to the admin dashboard page using navigate
      navigate('/admin-dashboard');
    } catch (error) {
      alert('Login Failed! Please check your credentials.');
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

        <p>
          Not an admin? <Link to="/admin-register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
