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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
        console.log("Sending data:", { first_name: firstName, last_name: lastName, email, username, password });

        const response = await axios.post('http://127.0.0.1:8000/register', 
            { 
                first_name: firstName,  // Match FastAPI field names
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <a href="/login" className="register-link">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
