import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is verified in sessionStorage
  const isVerified = sessionStorage.getItem("isVerified") === "true";

  if (!isVerified) {
    alert("Access denied! Please complete face verification.");
    navigate("/verify-face");
    return null;
  }

  return <h1>Welcome to Dashboard! 🎉</h1>;
};

export default Dashboard;
