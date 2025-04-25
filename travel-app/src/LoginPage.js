import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
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

    // Assuming the response contains the access_token, user_id, and first_name
    const { access_token, user_id, first_name } = response.data; // Modify your backend to return access_token
    localStorage.setItem('access_token', access_token); // Store access_token in local storage
    localStorage.setItem('user_id', user_id); // Store user_id in local storage
    localStorage.setItem('first_name', first_name); // Store first_name in local storage
    console.log("Access token stored in localStorage: ", localStorage.getItem('access_token'));
    console.log("User ID stored in localStorage: ", localStorage.getItem('user_id'));
    console.log("User First Name stored in localStorage: ", localStorage.getItem('first_name'));

    // Redirect to the home page
    navigate('/home');
  } catch (error) {
    alert('Login Failed!');
    console.error(error); // Log the error for debugging
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
