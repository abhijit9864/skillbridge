import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './AllUsers.css';
const api = import.meta.env.VITE_BASE_URL;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedStatus, setEditedStatus] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${api}/api/users/users`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditUser(user.user_id);
    setEditedName(user.name);
    setEditedRole(user.role);
    setEditedEmail(user.email);
    setEditedStatus(user.is_active);
  };

  const handleSave = async (userId) => {
    try {
      const user = users.find(user => user.user_id === userId);
      if (!user) {
        console.error("User not found");
        return;
      }

      // Ensure role mapping is correct
      const roleMapping = {
        "Student": 1,
        "Instructor": 3,
        "Organization Administrator": 2,
        "System Administrator": 4
      };
      const role_id = roleMapping[editedRole];

      if (!role_id) {
        console.error("Invalid role selection");
        return;
      }

      const response = await fetch(`${api}/api/users/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editedName, 
          email: editedEmail,
          role_id,
          is_active: editedStatus
        }),
      });

      if (response.ok) {
        fetchUsers();
        setEditUser(null);
      } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    // Add confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`${api}/api/users/delete/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
        alert("User deleted successfully!");
      } else {
        console.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="all-users-container">
      <h2>All Users</h2>

      {/* Search & Filter */}
      <div className="search-filter-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-dropdown"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Organization Administrator">Organization Admin</option>
          <option value="System Administrator">System Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>
                  {editUser === user.user_id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editUser === user.user_id ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editUser === user.user_id ? (
                    <select 
                      value={editedRole} 
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="edit-select"
                    >
                      <option value="Student">Student</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Organization Administrator">Organization Admin</option>
                      <option value="System Administrator">System Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className={`status ${editUser === user.user_id ? (editedStatus ? 'active' : 'inactive') : (user.is_active ? 'active' : 'inactive')}`}>
                  {editUser === user.user_id ? (
                    <select
                      value={editedStatus.toString()}
                      onChange={(e) => setEditedStatus(e.target.value === "true")}
                      className="edit-select"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    <span className={`status-text ${user.is_active ? 'active-text' : 'inactive-text'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
                <td className="action-buttons">
                  {editUser === user.user_id ? (
                    <button className="user-save-btn" onClick={() => handleSave(user.user_id)}>Save</button>
                  ) : (
                    <button className="user-edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                  )}
                  <button className="user-delete-btn" onClick={() => handleDelete(user.user_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-users-message">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
