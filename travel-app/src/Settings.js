import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import "./settings.css";
import Sidebar from "./AdminSidebar";

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({ first_name: "", last_name: "", email: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/users");
      setUsers(response.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Stop loading if there's an error
    }
  };
  fetchUsers();
}, []);


  const handleEdit = (index) => {
  setEditIndex(index);
  const user = users[index];
  setEditedUser({
    first_name: user.first_name || "", // Ensure default value if not available
    last_name: user.last_name || "",
    email: user.email || "",
  });
};


  const handleSave = async (user_id) => {
  try {
    const response = await axios.put(`http://localhost:8000/admin/users/${user_id}`, editedUser);
    // Directly update the users array with the updated user details
    const updatedUsers = users.map((user) =>
      user.user_id === user_id ? { ...user, ...editedUser } : user
    );
    setUsers(updatedUsers); // Update the users state
    setEditIndex(null); // Exit edit mode
  } catch (error) {
    console.error("Error updating user:", error);
  }
};


  const handleDeleteClick = (user_id) => {
    setDeleteUserId(user_id);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/admin/users/${deleteUserId}`);
      setUsers(users.filter((user) => user.user_id !== deleteUserId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowPopup(false);
      setDeleteUserId(null);
    }
  };

   if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
    <Sidebar/>
      <h2 className="section-title">User Settings</h2>
      <table className="settings-table">
        <thead>
          <tr className="table-header">
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map((user, index) => (
            <tr key={user.user_id} className="table-row">
              <td>
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editedUser.first_name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, first_name: e.target.value })
                      }
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editedUser.last_name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, last_name: e.target.value })
                      }
                      placeholder="Last Name"
                    />
                  </>
                ) : (
                  `${user.first_name} ${user.last_name}`
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <FaSave className="icon-button save-icon" onClick={() => handleSave(user.user_id)} />
                ) : (
                  <FaEdit className="icon-button edit-icon" onClick={() => handleEdit(index)} />
                )}
                <FaTrash
                  className="icon-button delete-icon"
                  onClick={() => handleDeleteClick(user.user_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Are you sure you want to delete this user?</p>
            <button className="popup-btn confirm" onClick={confirmDelete}>Yes</button>
            <button className="popup-btn cancel" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
