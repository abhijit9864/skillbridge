const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  fetchUsersWithRoles,
} = require("../controllers/userController");
// const pool = require("../config/db"); // ✅ Add this line

// Get all users
router.get("/users", getUsers);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/update/:id", updateUser);

// Soft delete user
router.delete("/delete/:id", deleteUser);

router.get("/roless", fetchUsersWithRoles); 


module.exports = router;
