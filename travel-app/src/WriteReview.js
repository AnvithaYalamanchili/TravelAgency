import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Writereview.css';
import Layout from './Layout';

const SuccessPopup = ({ onClose }) => (
  <div className="popup-overlay">
    <div className="popup">
      <p>✅ Your review has been submitted successfully!</p>
      <button onClick={onClose}>OK</button>
    </div>
  </div>
);

const WriteReview = () => {
  const { bookingId } = useParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5 || reviewText.trim() === '') {
      setError('Please provide a valid rating (1-5 stars) and review.');
      return;
    }

    setLoading(true);
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`http://127.0.0.1:8000/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          booking_id: bookingId,
          rating,
          review: reviewText,
        }),
      });

      if (response.ok) {
        setShowPopup(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Error submitting review.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/my-bookings');
  };

  return (
    <Layout>
      <div className="write-review-container">
        <h2>Write a Review</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Rating (1 to 5 stars):</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : ''}`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>

          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="5"
            placeholder="Share your experience..."
            required
          ></textarea>

          <button className='submit-btn' type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {showPopup && <SuccessPopup onClose={handlePopupClose} />}
    </Layout>
  );
};

export default WriteReview;
