import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import './VerifyFacePage.css';
import { useNavigate } from 'react-router-dom';

const VerifyFacePage = () => {
  const [passportImage, setPassportImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Handle file input for passport image
  const handleFileChange = (event) => {
    setPassportImage(event.target.files[0]);
  };

  // Start the camera to capture live selfie
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Ensure videoRef is not null before setting srcObject
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraActive(true);
        })
        .catch((error) => {
          alert("Error accessing camera: " + error);
        });
    } else {
      alert("Camera is not available on this device.");
    }
  };

  // Capture the live selfie when the user clicks the button
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelfieImage(file);
        setIsCameraActive(false); // Stop the camera after capturing
        videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop all tracks
      });
    }
  };

  const handleVerify = async () => {
    if (!passportImage || !selfieImage) {
      alert("Please upload both images.");
      return;
    }
  
    const formData = new FormData();
    formData.append("passport_image", passportImage);
    formData.append("selfie_image", selfieImage);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/verify-face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data.verified) {
        alert("Face verification successful! Completing registration...");
    
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    
        if (!userDetails) {
          alert("No user data found. Please register again.");
          return;
        }
    
        // Send user data to backend for final registration
        const registrationResponse = await axios.post("http://127.0.0.1:8000/register", userDetails, {
          headers: { "Content-Type": "application/json" },
        });
    
        const user_id = registrationResponse.data.user_id;
        
        // Store user_id in localStorage
        localStorage.setItem("user_id", String(user_id));
    
        alert("Registration completed successfully!");
        
        // Navigate to travel preferences page without userId in URL
        navigate("/travel-preferences");
      } else {
        alert("Face verification failed. Please try again.");
      }
    } catch (error) {
      alert("Verification failed.");
      console.error("Verification error:", error.response ? error.response.data : error.message);
    }
  };
  

  // Ensure the camera is started only after component mounts
  useEffect(() => {
    // This effect will run when the component is mounted
    if (isCameraActive) {
      startCamera();
    }

    return () => {
      // Cleanup: stop the camera if the component is unmounted
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]); // Only run effect when isCameraActive changes

  return (
    <div className="container">
      <h1>Face Verification</h1>

      {/* Passport Image Upload */}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p>Upload your Passport/ID Photo</p>
        <button className="verification-button" onClick={handleVerify}>Verify</button>
      </div>

      {/* Camera Stream for Live Selfie */}
      <div>
        {isCameraActive ? (
          <>
            <video ref={videoRef} autoPlay width="320" height="240"></video>
            <button onClick={captureSelfie}>Capture Selfie</button>
          </>
        ) : (
          <button onClick={() => setIsCameraActive(true)}>Start Camera</button>
        )}
        <p>Take a Live Selfie</p>
      </div>

      {/* Canvas to display the captured selfie (hidden) */}
      <canvas ref={canvasRef} style={{ display: "none" }} width="320" height="240"></canvas>

      <button className="verification-button" onClick={handleVerify}>Verify</button>

      {verificationStatus !== null && (
        <p className={verificationStatus ? "success" : "error"}>
          {verificationStatus ? "✅ Verification Successful!" : "❌ Verification Failed!"}
        </p>
      )}
    </div>
  );
};

export default VerifyFacePage;

