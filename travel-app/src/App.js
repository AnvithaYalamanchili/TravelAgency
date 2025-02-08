import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Make sure to import 'Navigate'
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login by default */}
      </Routes>
    </Router>
  );
};

export default App;
