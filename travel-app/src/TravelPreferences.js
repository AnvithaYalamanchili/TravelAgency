import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TravelPreferences.css';
import { useNavigate } from 'react-router-dom';

const TravelPreferences = () => {
  const [preferences, setPreferences] = useState({
    vacationType: '',
    tripDuration: '',
    budget: '',
    accommodation: '',
    travelStyle: '',
    activities: '',
    socialInteraction: '',
    sleepSchedule: '',
    sustainability: '',
    companion: '',
    sharedAccommodation: '',
    tripPlanning: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  // State for user_id
  const [userId, setUserId] = useState('');

  // Use useEffect to retrieve user_id from localStorage only on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) {
      setMessage('User is not logged in.');
      return;
    }
    setUserId(storedUserId);
  }, []);  // Empty dependency array ensures this runs only once after component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      setMessage('User is not logged in.');
      return;
    }
  
    // Ensure backend expects snake_case instead of camelCase
    const preferencesData = {
      user_id: Number(userId),
      vacation_type: preferences.vacationType,
      trip_duration: preferences.tripDuration,
      budget: preferences.budget,
      accommodation: preferences.accommodation,
      travel_style: preferences.travelStyle,
      activities: preferences.activities,
      social_interaction: preferences.socialInteraction,
      sleep_schedule: preferences.sleepSchedule,
      sustainability: preferences.sustainability,
      companion: preferences.companion,
      shared_accommodation: preferences.sharedAccommodation,
      trip_planning: preferences.tripPlanning,
    };
  
    console.log("Preferences data being sent:", preferencesData);
  
    try {
      await axios.post('http://127.0.0.1:8000/travel-preferences', preferencesData);
      
      // Set success message
      setMessage('Your preferences have been saved successfully! Redirecting to the Login page...');
  
      // Redirect after 2 seconds to the home page
      setTimeout(() => {
        navigate('/login'); // Replace with the actual home page route if different
      }, 2000);
  
    } catch (error) {
      setMessage('Failed to save preferences. Please try again.');
    }
  };
  

  return (
    <div className="preferences-container">
      <h2>Travel Preferences</h2>
      <form onSubmit={handlePreferencesSubmit}>
        <label>1. What is your preferred type of vacation?</label>
        <select name="vacationType" value={preferences.vacationType} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Beach">Beach</option>
          <option value="Adventure">Adventure</option>
          <option value="Cultural">Cultural</option>
          <option value="Nature">Nature</option>
          <option value="Urban">Urban</option>
        </select>

        <label>2. What is your preferred trip duration?</label>
        <select name="tripDuration" value={preferences.tripDuration} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Weekend">Weekend (1-3 days)</option>
          <option value="Short">Short (4-7 days)</option>
          <option value="Long">Long (8+ days)</option>
        </select>

        <label>3. What is your typical travel budget?</label>
        <select name="budget" value={preferences.budget} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>4. What type of accommodation do you prefer?</label>
        <select name="accommodation" value={preferences.accommodation} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Hotel">Hotel</option>
          <option value="Hostel">Hostel</option>
          <option value="Airbnb">Airbnb</option>
          <option value="Resort">Resort</option>
          <option value="Camping">Camping</option>
          <option value="Shared house">Shared house</option>
        </select>

        <label>5. How do you prefer to travel?</label>
        <select name="travelStyle" value={preferences.travelStyle} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Solo">Solo</option>
          <option value="Friends">With Friends</option>
          <option value="Family">Family</option>
          <option value="Group Tours">Group Tours</option>
          <option value="Couple">Couple</option>
        </select>

        <label>6. What activities do you enjoy most while traveling?</label>
        <select name="activities" value={preferences.activities} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="Hiking">Hiking</option>
          <option value="Beach activities">Beach activities</option>
          <option value="Museums">Museums</option>
          <option value="Shopping">Shopping</option>
          <option value="Adventure sports">Adventure sports</option>
        </select>

        <label>7. How much social interaction do you prefer on a trip?</label>
        <select name="socialInteraction" value={preferences.socialInteraction} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Very social">Very social</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
          <option value="Prefer solitude">Prefer solitude</option>
        </select>

        <label>8. Are you an early riser or a night owl when traveling?</label>
        <select name="sleepSchedule" value={preferences.sleepSchedule} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Early riser">Early riser</option>
          <option value="Night owl">Night owl</option>
          <option value="Flexible">Flexible</option>
        </select>

        <label>9. How important is sustainability and eco-friendliness to you?</label>
        <select name="sustainability" value={preferences.sustainability} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Very important">Very important</option>
          <option value="Somewhat important">Somewhat important</option>
          <option value="Not important">Not important</option>
        </select>

        <label>10. Would you prefer a travel companion who shares similar interests or someone with a different perspective?</label>
        <select name="companion" value={preferences.companion} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Similar interests">Similar interests</option>
          <option value="Different perspectives">Different perspectives</option>
        </select>

        <label>11. What’s your attitude toward shared accommodations (e.g., hostels, dorms)?</label>
        <select name="sharedAccommodation" value={preferences.sharedAccommodation} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Comfortable">Comfortable</option>
          <option value="Open to it but prefer privacy">Open to it but prefer privacy</option>
          <option value="Prefer private accommodations">Prefer private accommodations</option>
        </select>

        <label>12. What’s your approach to planning a trip?</label>
        <select name="tripPlanning" value={preferences.tripPlanning} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Fully planned">Fully planned</option>
          <option value="Some structure but flexible">Some structure but flexible</option>
          <option value="Spontaneous">Spontaneous</option>
        </select>

        <button type="submit">Save Preferences</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default TravelPreferences;


