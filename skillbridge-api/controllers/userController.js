const User = require("../models/userModel");
const db = require("../config/db"); // Ensure DB connection

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    const formattedUsers = users.map(user => ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role_name ? user.role_name : "No Role Assigned", // Show proper message if no role
      is_active: user.is_active
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let { name, email, role_id } = req.body;

    // Ensure role_id is an integer (fixes role_id being a hashed password)
    if (role_id) {
      role_id = parseInt(role_id);
      if (isNaN(role_id)) {
        return res.status(400).json({ message: "Invalid role_id" });
      }
    }

    // Check if at least one field is provided
    if (!name && !email && !role_id) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    console.log("Updating user:", { userId, name, email, role_id });

    // Fetch existing user details
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use existing values if fields are not provided
    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    const updatedRoleId = role_id || user.role_id;

    // Update user in DB (fixed incorrect parameter order)
    const updateSuccess = await User.updateUser(userId, updatedName, updatedEmail, updatedRoleId);

    if (!updateSuccess) {
      return res.status(400).json({ message: "Failed to update user" });
    }

    // Fetch updated user details to return the new data
    const updatedUser = await User.getUserById(userId);

    res.json({
      message: "User updated successfully",
      user: updatedUser, // Return updated user data
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Soft delete a user (Deactivate user instead of permanent deletion)
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query("UPDATE user SET is_active = ? WHERE user_id = ?", [false, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or already inactive" });
    }

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};


const fetchUsersWithRoles = async (req, res) => {
  try {
    const users = await User.getUsersWithRoles();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found with assigned roles" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// ✅ Correct export
module.exports = { getUsers, getUserById, updateUser, deleteUser, fetchUsersWithRoles };
