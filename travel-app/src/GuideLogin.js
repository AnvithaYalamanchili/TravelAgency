import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './GuideLogin.css'; 

const GuideLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize 'useNavigate' hook for navigation

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    let formErrors = {};
  
    if (!email.trim()) formErrors.email = "Email is required";
    else if (!validateEmail(email)) formErrors.email = "Invalid email format";
  
    if (!password.trim()) formErrors.password = "Password is required";
    else if (password.length < 6) formErrors.password = "Password must be at least 6 characters";
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/guides/login', { email, password });
      alert('Login Successful!');
  
      // Assuming the response contains the full name and Guide ID
      const { guide_id, full_name } = response.data; // Modify backend to return guide_id and full_name
      localStorage.setItem('guide_id', guide_id); // Store guide_id in local storage
      localStorage.setItem('full_name', full_name); // Store full_name in local storage
      console.log("Guide ID stored in localStorage: ", localStorage.getItem('guide_id'));
      console.log("Guide Full Name stored in localStorage: ", localStorage.getItem('full_name'));
  
      // Redirect to the home page
      navigate('/guideshome');
    } catch (error) {
      alert('Login Failed!');
    }
  };
  

  return (
    <div className="login-page-background">
      <div className="login-container">
        <h2 className='login'>Guides Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

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

export default GuideLogin;
