import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchedUsers.css'; // Import the CSS for styling

const MatchedUsers = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('Please log in to view matched users.');
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/matched-users/${userId}`);
        setMatchedUsers(response.data);
      } catch (error) {
        setError('Error fetching matched users.');
      }
    };

    fetchMatchedUsers();
  }, []);

  return (
    <div className="matched-users-page">
      <h2 className="title">Top Matched Users</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="matched-users-list">
        {matchedUsers.map((user) => (
          <div className="user-card" key={user.user_id}>
            <div className="user-avatar">
              <img src={`https://www.gravatar.com/avatar/${user.user_id}`} alt="User Avatar" className="avatar" />
            </div>
            <div className="user-details">
              <h3>{user.first_name} {user.last_name}</h3>
              <p className="matching-score">Matching Score: {Math.round(user.similarity_score * 100)}%</p>
              <button onClick={() => alert(`You expressed interest in ${user.first_name} ${user.last_name}`)} className="express-interest-btn">Express Interest</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchedUsers;
