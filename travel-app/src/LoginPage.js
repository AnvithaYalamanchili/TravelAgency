import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use 'useNavigate' hook for navigation
import './LoginPage.css'; 

const LoginPage = () => {
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
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      alert('Login Successful!');
  
      // Assuming the response contains the user_id
      const user_id = response.data.user_id; // Modify backend to return user_id
      localStorage.setItem('user_id', user_id); // Store user_id in local storage
      console.log("User ID stored in localStorage: ", localStorage.getItem('user_id'));
  
      // Redirect to travel preferences page using navigate
      navigate('/travel-preferences');
    } catch (error) {
      alert('Login Failed!');
    }
  };  
  

  return (
    <div className="login-page-background">
      <div className="login-container">
        <h2 className='login'>Login</h2>
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

        <p>
          Not a user? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
