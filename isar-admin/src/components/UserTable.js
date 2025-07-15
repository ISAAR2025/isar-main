import React, { useEffect, useState } from 'react';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch(err => console.error('User fetch error:', err));
  }, []);

const filteredUsers = users.filter(
  (user) => {
    const name = user.name || "";
    const email = user.email || "";
    const userId = user._id !== undefined ? user._id.toString() : "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      userId.includes(search)
    );
  }
);




  return (
    <div className="user-table-container">
      <h2>Registered Users</h2>

     <input
  type="text"
  placeholder="Search by ID, name, or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>


      {/* Desktop Table View */}
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>USER ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Registered At</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, idx) => (
            <tr key={user.id}>
              <td>{idx + 1}</td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="user-card-list">
        {filteredUsers.map((user, idx) => (
          <div className="user-card" key={user.id}>
            <h4>{user.name}</h4>
            <p><strong>USER ID:</strong>{user._id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Registered:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
