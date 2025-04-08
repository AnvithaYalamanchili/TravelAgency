import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import { TripCard } from "./HomePage";
import Layout from "./Layout";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [likedTrips, setLikedTrips] = useState([]);
  const [avatarStyle, setAvatarStyle] = useState("adventurer");
  const [avatarSeed, setAvatarSeed] = useState("user");
  const [avatarGallery, setAvatarGallery] = useState([]);
  const [avatarSaved, setAvatarSaved] = useState(false); // Track if avatar is saved
  const [showGallery, setShowGallery] = useState(false); // Control avatar gallery visibility

  // Load saved avatar settings from localStorage
  const loadAvatarSettings = (userId) => {
    const savedStyle = localStorage.getItem(`${userId}_avatarStyle`);
    const savedSeed = localStorage.getItem(`${userId}_avatarSeed`);
    if (savedStyle) setAvatarStyle(savedStyle);
    if (savedSeed) setAvatarSeed(savedSeed);
  };

  // Save avatar settings to localStorage
  const saveAvatarSettings = (userId, style, seed) => {
    localStorage.setItem(`${userId}_avatarStyle`, style);
    localStorage.setItem(`${userId}_avatarSeed`, seed);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("No access token found");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setAvatarSeed(response.data.username); // Fallback seed
        const userId = localStorage.getItem("user_id");

        if (userId) {
          loadAvatarSettings(userId); // Load avatar settings if any
          const savedLikes = JSON.parse(
            localStorage.getItem(`${userId}_likedTrips`) || "[]"
          );
          setLikedTrips(savedLikes);
        }
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  // Generate avatar gallery whenever style changes
  useEffect(() => {
    const generateGallery = () => {
      const gallery = [];
      for (let i = 1; i <= 12; i++) {
        gallery.push(`${avatarStyle}_seed${i}`);
      }
      setAvatarGallery(gallery);
    };

    generateGallery();
  }, [avatarStyle]);

  const handleAvatarStyleChange = (e) => {
    const newStyle = e.target.value;
    setAvatarStyle(newStyle);
    setShowGallery(true); // Show gallery when a style is selected
    const userId = localStorage.getItem("user_id");
    if (userId) saveAvatarSettings(userId, newStyle, avatarSeed);
  };

  const handleAvatarSeedChange = (e) => {
    const newSeed = e.target.value;
    setAvatarSeed(newSeed);
    const userId = localStorage.getItem("user_id");
    if (userId) saveAvatarSettings(userId, avatarStyle, newSeed);
  };

  const handleAvatarSelect = (seed) => {
    setAvatarSeed(seed);
    const userId = localStorage.getItem("user_id");
    if (userId) saveAvatarSettings(userId, avatarStyle, seed);
  };

  const handleSaveAvatar = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      saveAvatarSettings(userId, avatarStyle, avatarSeed);
      setAvatarSaved(true); // Mark avatar as saved
      setShowGallery(false); // Hide the gallery after saving
      alert("Avatar has been saved!");
    } else {
      alert("Failed to save avatar. User ID not found.");
    }
  };

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <Layout>
    <div className="container">
      {/* Sidebar */}
      <div className="sidebars">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${avatarSeed}`}
            alt="Profile"
            className="avatar"
          />
          <h2>{userData.first_name} {userData.last_name}</h2>
          <p>{userData.email}</p>

          {/* Avatar Selector */}
          <div className="avatar-selector">
            <label style={{ color: "white" }}>Choose Avatar Style:</label>
            <select
              value={avatarStyle}
              onChange={handleAvatarStyleChange}
            >
              <option value="adventurer">Adventurer</option>
              <option value="adventurer-neutral">Adventurer Neutral</option>
              <option value="avataaars">Avataaars</option>
              <option value="bottts">Bottts</option>
              <option value="notionists">Notionists</option>
              <option value="thumbs">Thumbs</option>
            </select>
          </div>

          <div className="avatar-seed">
            <label style={{ color: "white" }}>Avatar Name (Seed):</label>
            <input
              type="text"
              value={avatarSeed}
              onChange={handleAvatarSeedChange}
            />
          </div>

          {/* Avatar Gallery Preview (will disappear after save) */}
          {showGallery && !avatarSaved && (
            <div className="avatar-gallery">
              <p style={{ color: "white" }}>Click to select an avatar:</p>
              <div className="avatar-grid">
                {avatarGallery.map((seed) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${seed}`}
                    alt="Avatar Option"
                    className={`avatar-option ${avatarSeed === seed ? "selected" : ""}`}
                    onClick={() => handleAvatarSelect(seed)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Save Avatar Button */}
          <button onClick={handleSaveAvatar} className="save-avatar-btn">
            Save Avatar
          </button>
        </div>

        <div className="profile-menu">
          <p>📄 Profile</p>
          <p>🕑 Recent Activity <span className="badge">{likedTrips.length}</span></p>
          <p>✏️ Edit Profile</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="bio-graph">
          <h3>Bio Graph</h3>
          <div className="bio-grid">
            <p><strong>First Name</strong>: {userData.first_name}</p>
            <p><strong>Last Name</strong>: {userData.last_name}</p>
            <p><strong>Birthday</strong>: {userData.dob}</p>
            <p><strong>Email</strong>: {userData.email}</p>
            <p><strong>Username</strong>: {userData.username}</p>
          </div>
        </div>

        {/* Favorite Trips Section */}
        <h3 style={{ color: 'white' }}>Favorite Trips</h3>
        <div className="trip-container">
          {likedTrips.map((trip, index) => (
            <TripCard
              key={index}
              title={trip}
              image={`./${trip.toLowerCase().replace(/\s+/g, '')}.jpg`}
              onLike={() => {}}
              isLiked={true}
            />
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default UserProfile;
