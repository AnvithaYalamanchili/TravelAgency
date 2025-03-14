import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!dob.trim()) newErrors.dob = "Date of Birth is required";
    if (!passportNumber.trim()) newErrors.passportNumber = "Passport Number is required";
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
    if (!validateForm()) return;

    // Store user details temporarily in sessionStorage
    sessionStorage.setItem("userDetails", JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        dob,
        passport_number: passportNumber,
        email,
        username,
        password
    }));
   
    alert("Proceed to face verification.");
    navigate('/verify-face');  // Redirect to face verification
};


  return (
    <div className="register-page-background">
      <div className="register-container">
        <h2 style={{ color: 'Black' }}>Register</h2>
        <p className="info-text">Please enter your details exactly as in your passport.</p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
          <input type="text" placeholder="Passport Number" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          {/* Submit button */}
          <button className='register-btn' type="submit">Register</button>
        </form>

        <p style={{ color: 'Black' }}>
          Already have an account? <a href="/login" className="register-link">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
