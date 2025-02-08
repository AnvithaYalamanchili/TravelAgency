import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({});

    let formErrors = {};

    if (!email.trim()) {
      formErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      formErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    // If there are errors, set them and return
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      alert('Login Successful!');
    } catch (error) {
      alert('Login Failed!');
    }
  };

  return (
    <div className="login-container">
      <h2 style={{'color':'white'}}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit">Login</button>
      </form>
      <p style={{'color':'white'}}>
        Not a user?{' '}
        <Link to="/register" className="register-link">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
