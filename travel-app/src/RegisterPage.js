import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if form is invalid

    try {
      console.log("Sending data:", { first_name: firstName, last_name: lastName, email, username, password });

      const response = await axios.post('http://127.0.0.1:8000/register', 
        { 
          first_name: firstName,
          last_name: lastName, 
          email, 
          username, 
          password 
        }, 
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);
      alert('Registration Successful!');
      navigate('/login');
    } catch (error) {
      console.error("Registration Error:", error.response ? error.response.data : error.message);
      alert('Registration Failed!');
    }
  };

  return (
    <div className="register-container">
      <h2 style={{'color':'white'}}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName && <p className="error-text">{errors.firstName}</p>}

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit">Register</button>
      </form>
      <p style={{'color':'white'}}>
        Already have an account?{' '}
        <a href="/login" className="register-link">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
