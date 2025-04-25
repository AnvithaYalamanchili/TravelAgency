import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import { TripCard } from "./HomePage";
import Layout from "./Layout";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null); // Store original data for cancel
  const [error, setError] = useState(null);
  const [likedTrips, setLikedTrips] = useState([]);
  const [avatarStyle, setAvatarStyle] = useState("adventurer");
  const [avatarSeed, setAvatarSeed] = useState("user");
  const [avatarGallery, setAvatarGallery] = useState([]);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editSuccess, setEditSuccess] = useState(false); // Track successful edit

  const loadAvatarSettings = (userId) => {
    const savedStyle = localStorage.getItem(`${userId}_avatarStyle`);
    const savedSeed = localStorage.getItem(`${userId}_avatarSeed`);
    if (savedStyle) setAvatarStyle(savedStyle);
    if (savedSeed) setAvatarSeed(savedSeed);
  };

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
        setOriginalUserData(response.data); // Store original data
        setAvatarSeed(response.data.username);
        const userId = localStorage.getItem("user_id");

        if (userId) {
          loadAvatarSettings(userId);
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
    setShowGallery(true);
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
      setAvatarSaved(true);
      setShowGallery(false);
      alert("Avatar has been saved!");
    } else {
      alert("Failed to save avatar. User ID not found.");
    }
  };

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // If canceling edit, revert to original data
      setUserData(originalUserData);
    }
    setIsEditing(!isEditing);
    setEditSuccess(false);
  };

  // Save edited profile
  const saveProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found");
      return;
    }

    const response = await axios.put(
      "http://127.0.0.1:8000/profile",
      {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        dob: userData.dob,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setUserData(response.data);
    setOriginalUserData(response.data);
    setIsEditing(false);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  } catch (error) {
    if (error.response) {
      setError(error.response.data.detail || "Failed to update profile");
    } else {
      setError("Network error - please try again");
    }
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
            <h2>
              {userData.first_name} {userData.last_name}
            </h2>
            <p>{userData.email}</p>

            {/* Avatar Selector */}
            <div className="avatar-selector">
              <label style={{ color: "white" }}>Choose Avatar Style:</label>
              <select value={avatarStyle} onChange={handleAvatarStyleChange}>
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

            {showGallery && !avatarSaved && (
              <div className="avatar-gallery">
                <p style={{ color: "white" }}>Click to select an avatar:</p>
                <div className="avatar-grid">
                  {avatarGallery.map((seed) => (
                    <img
                      key={seed}
                      src={`https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${seed}`}
                      alt="Avatar Option"
                      className={`avatar-option ${
                        avatarSeed === seed ? "selected" : ""
                      }`}
                      onClick={() => handleAvatarSelect(seed)}
                    />
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleSaveAvatar} className="save-avatar-btn">
              Save Avatar
            </button>
          </div>

          <div className="profile-menu">
            <p>📄 Profile</p>
            <p>
              🕑 Recent Activity <span className="badge">{likedTrips.length}</span>
            </p>
            <p className="edit" onClick={toggleEditMode}>
              ✏️ {isEditing ? "Cancel Edit" : "Edit Profile"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="main">
          {editSuccess && (
            <div className="alert alert-success">
              Profile updated successfully!
            </div>
          )}
          
          <div className="bio-graph">
            <h3 className="bio" style={{textAlign:"center", fontFamily:"'Urbanist', sans-serif;"}}>Bio Graph</h3>
            <div className="bio-grid">
              <p>
                <strong>First Name</strong>:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  userData.first_name
                )}
              </p>
              <p>
                <strong>Last Name</strong>:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  userData.last_name
                )}
              </p>
              <p>
                <strong>Birthday</strong>:{" "}
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={userData.dob}
                    onChange={handleInputChange}
                  />
                ) : (
                  userData.dob
                )}
              </p>
              <p>
                <strong>Email</strong>:{" "}
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  userData.email
                )}
              </p>
              <p>
                <strong>Username</strong>: {userData.username}
              </p>
            </div>
            
            {isEditing && (
              <button onClick={saveProfile} className="save-profile-btn">
                Save Profile
              </button>
            )}
          </div>

          {/* Favorite Trips Section */}
          <h3 className="ft" style={{ color: "black",textAlign:"center", marginTop:'30px' }}>Favorite Trips</h3>
          <div className="trip-container" style={{marginTop:"50px"}}>
            {likedTrips.length > 0 ? (
              likedTrips.map((trip) => (
                <TripCard
                  key={trip.place_id || trip.location_id}
                  title={trip.place_name || trip.location_name}
                  image={trip.image}
                  onLike={() => {}}
                  isLiked={true}
                  isLocation={!!trip.location_id}
                  location_id={trip.location_id}
                  place_overview={trip.place_overview}
                />
              ))
            ) : (
              <p>No favorite trips yet. Like some trips to see them here!</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;