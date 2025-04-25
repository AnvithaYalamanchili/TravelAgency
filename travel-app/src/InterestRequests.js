import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import './InterestRequests.css';

const InterestRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('Please log in to view requests.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/interest-requests/received/${userId}`
        );
        setRequests(response.data.requests);
      } catch (error) {
        setError('Error fetching requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestResponse = async (requestId, status) => {
    try {
      console.log(`Attempting to ${status} request ${requestId}`);
      
      const request = requests.find(req => req.request_id === requestId);
      if (!request) {
        alert('Request not found');
        return;
      }
  
      // Send the status in the correct format
      const response = await axios.put(
        `http://127.0.0.1:8000/interest-requests/${requestId}`,
        { status },  // This matches what the backend expects
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.status === "success") {
        setRequests(prev => prev.filter(req => req.request_id !== requestId));
        alert(`Request ${status}`);
      } else {
        alert(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      let errorMessage = 'Failed to update request';
      
      if (error.response) {
        errorMessage = error.response.data.detail || 
                      JSON.stringify(error.response.data);
        console.error('Backend error:', error.response.data);
      } else {
        console.error('Request error:', error.message);
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    }
  };
  return (
    <Layout>
      <div className="interest-requests-container">
        <header className="requests-header">
          <h1>Notifications</h1>
        </header>

        {loading ? (
          <div className="loading-spinners">
            <div className="spinner"></div>
            <p>Loading your requests...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Link to="/login" className="login-link">Go to Login</Link>
          </div>
        ) : requests.length === 0 ? (
          <div className="no-requests">
            <h3>No pending requests</h3>
            <p>You don't have any pending interest requests at this time.</p>
            <Link to="/matched-users" className="back-link">
              Back to Matched Users
            </Link>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div className="request-card" key={request.request_id}>
                <div className="request-header">
                  <img
                    src={`https://www.gravatar.com/avatar/${request.sender_id}?d=identicon`}
                    alt={`${request.first_name} ${request.last_name}`}
                    className="request-avatar"
                  />
                  <div className="request-info">
                    <h3>{request.first_name} {request.last_name}</h3>
                    <p>wants to connect with you!</p>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleRequestResponse(request.request_id, 'accepted')}
                    className="accept-btn"
                  >
                    <i className="icon-check"></i> Accept
                  </button>
                  <button
                    onClick={() => handleRequestResponse(request.request_id, 'declined')}
                    className="decline-btn"
                  >
                    <i className="icon-x"></i> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InterestRequests;