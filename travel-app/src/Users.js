import React, { useState, useEffect } from "react";
import axios from "axios";
import './Users.css';
import Sidebar from "./AdminSidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/users"); // Adjust the API endpoint as needed
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
    <Sidebar/>
      <h2>All Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Date of Birth</th>
              <th>Passport Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.dob}</td>
                <td>{user.passport_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
