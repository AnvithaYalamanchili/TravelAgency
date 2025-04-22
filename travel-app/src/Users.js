import React, { useState, useEffect } from "react";
import axios from "axios";
import './Users.css';
import Sidebar from "./AdminSidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]); // New state for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get("http://localhost:8000/admin/users");
        setUsers(usersResponse.data);
        
        // Fetch reviews
        const reviewsResponse = await axios.get("http://localhost:8000/admin/reviews");
        setReviews(reviewsResponse.data);
        
      } catch (error) {
        setError("Error fetching users and reviews");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <Sidebar />
      <h2>All Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          {/* Users Table */}
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

          {/* Reviews Table */}
          
          <h2>User Reviews</h2>
<table className="reviews-table">
  <thead>
    <tr>
      <th>Location Name</th>
      <th>User ID</th>
      <th>Booking ID</th>
      <th>Rating</th>
      <th>Review</th>
      <th>Created At</th>
    </tr>
  </thead>
  <tbody>
    {reviews.map((review) => (
      <tr key={review.review_id}>
        <td>{review.place_name}</td>
        <td>{review.user_id}</td>
        <td>{review.booking_id}</td>
        <td className={review.rating < 3 ? "rating-low" : "rating-high"}>
          {review.rating}
        </td>
        <td>{review.review}</td>
        <td>{new Date(review.created_at).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
};

export default Users;
