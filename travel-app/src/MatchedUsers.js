import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import './MatchedUsers.css';

const MatchedUsers = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('Please log in to view matched users.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/matched-users/${userId}`);
        // Fetch request status for each matched user
        const usersWithStatus = await Promise.all(
          response.data.map(async (user) => {
            const statusRes = await axios.get(
              `http://127.0.0.1:8000/interest-requests/status/${userId}/${user.user_id}`
            );
            return {
              ...user,
              requestStatus: statusRes.data.request?.status || null,
              isReceiver: statusRes.data.request?.receiver_id == userId
            };
          })
        );
        setMatchedUsers(usersWithStatus);
      } catch (error) {
        setError('Error fetching matched users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedUsers();
  }, []);

  const handleExpressInterest = async (user) => {
    try {
      const userId = localStorage.getItem('user_id');
      await axios.post('http://127.0.0.1:8000/interest-requests', {
        sender_id: userId,
        receiver_id: user.user_id,
        status: 'pending'
      });
      
      // Update the UI
      setMatchedUsers(prev => prev.map(u => 
        u.user_id === user.user_id 
          ? {...u, requestStatus: 'pending', isReceiver: false} 
          : u
      ));
      
      alert(`Interest request sent to ${user.first_name} ${user.last_name}`);
    } catch (error) {
      alert('Failed to send interest request: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleAcceptRequest = async (user) => {
    try {
      const userId = localStorage.getItem('user_id');
      // First get the request ID
      const statusRes = await axios.get(
        `http://127.0.0.1:8000/interest-requests/status/${userId}/${user.user_id}`
      );
      
      if (statusRes.data.request?.request_id) {
        await axios.put(
          `http://127.0.0.1:8000/interest-requests/${statusRes.data.request.request_id}`,
          { status: 'accepted' }
        );
        
        // Update the UI
        setMatchedUsers(prev => prev.map(u => 
          u.user_id === user.user_id 
            ? {...u, requestStatus: 'accepted'} 
            : u
        ));
        
        alert(`You are now connected with ${user.first_name} ${user.last_name}`);
      }
    } catch (error) {
      alert('Failed to accept request: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeclineRequest = async (user) => {
    try {
      const userId = localStorage.getItem('user_id');
      // First get the request ID
      const statusRes = await axios.get(
        `http://127.0.0.1:8000/interest-requests/status/${userId}/${user.user_id}`
      );
      
      if (statusRes.data.request?.request_id) {
        await axios.put(
          `http://127.0.0.1:8000/interest-requests/${statusRes.data.request.request_id}`,
          { status: 'declined' }
        );
        
        // Update the UI - reset to no request status
        setMatchedUsers(prev => prev.map(u => 
          u.user_id === user.user_id 
            ? {...u, requestStatus: null} 
            : u
        ));
      }
    } catch (error) {
      alert('Failed to decline request: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Layout>
      <div className="matched-users-container">
        <header className="matched-users-header">
          <h1>Your Travel Companions</h1>
          <p className="subtitle">Connect with travelers who share your preferences</p>
        </header>

        {loading ? (
          <div className="loading-spinners">
            <div className="spinner"></div>
            <p>Finding your perfect matches...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Link to="/login" className="login-link">Go to Login</Link>
          </div>
        ) : matchedUsers.length === 0 ? (
          <div className="no-matches">
            <img src="/images/no-matches.svg" alt="No matches found" />
            <h3>No matches found yet</h3>
            <p>Update your travel preferences to find better matches</p>
            <Link to="/travel-preferences" className="preferences-link">
              Update Preferences
            </Link>
          </div>
        ) : (
          <>
            <div className="matches-grid">
              {matchedUsers.map((user) => (
                <div className="match-card" key={user.user_id}>
                  <div className="card-header">
                    <div className="avatar-container">
                      <img 
                        src={`https://www.gravatar.com/avatar/${user.user_id}?d=identicon`} 
                        alt={`${user.first_name} ${user.last_name}`} 
                        className="user-avatar"
                      />
                      <div className="compatibility-badge">
                        {Math.round(user.similarity_score * 100)}%
                      </div>
                    </div>
                    <h3>{user.first_name} {user.last_name}</h3>
                  </div>
                  
                  <div className="match-details">
                    <div className="detail-item">
                      <span>Travel Style:</span>
                      <span>{user.travel_style || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span>Trip Duration:</span>
                      <span>{user.trip_duration || 'Flexible'}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    {user.requestStatus === 'accepted' ? (
                      <Link 
                        to={`/chat/${localStorage.getItem('user_id')}/${user.user_id}`}
                        className="chat-btn active"
                      >
                        <i className="icon-message"></i> Start Chat
                      </Link>
                    ) : user.requestStatus === 'pending' && !user.isReceiver ? (
                      <button className="interest-btn pending" disabled>
                        <i className="icon-clock"></i> Request Pending
                      </button>
                    ) : user.requestStatus === 'pending' && user.isReceiver ? (
                      <div className="request-actions">
                        <button 
                          onClick={() => handleAcceptRequest(user)}
                          className="accept-btn"
                        >
                          <i className="icon-check"></i> Accept
                        </button>
                        <button 
                          onClick={() => handleDeclineRequest(user)}
                          className="decline-btn"
                        >
                          <i className="icon-x"></i> Decline
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleExpressInterest(user)}
                        className="interest-btn"
                      >
                        <i className="icon-heart"></i> Express Interest
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="view-requests-link">
              <Link to="/interest-requests">View Your Interest Requests</Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MatchedUsers;