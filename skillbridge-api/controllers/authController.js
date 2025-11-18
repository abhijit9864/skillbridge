
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Controller for user registration
const register = async (req, res) => {
    try {
        const { name, email, password, role_id, organization_id } = req.body;

        if (!name || !email || !password || !role_id || !organization_id) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Ensure password is a string before hashing
        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid password format' });
        }

        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await User.createUser(name, email, hashedPassword, role_id, organization_id);
        res.status(201).json({ message: 'User registered successfully', userId });

    } catch (err) {
        console.error("Error in register:", err);
        res.status(500).json({ message: 'Error saving user', error: err.message });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is active
        if (user.is_active === 0) {
            return res.status(403).json({ message: "Your account is inactive. Please contact the administrator." });
        }

        // Ensure the user object has a valid password_hash field
        if (!user.password_hash) {
            return res.status(500).json({ message: "Invalid user data: Missing password hash" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Remove password hash before sending response
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json({ message: "Login successful", user: userWithoutPassword });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



// Controller for getting user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password hash before sending response
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};


// Controller for updating user
const updateUser = async (req, res) => {
    const { email, password, role_id, organization_id } = req.body;
    const userId = req.params.id;

    if (!email || !role_id || !organization_id) {
        return res.status(400).json({ message: 'Please provide all required fields except password' });
    }

    try {
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await User.updateUser(userId, email, hashedPassword, role_id, organization_id);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};


// Controller for deleting user
const deleteUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.deleteUser(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

// Export all controllers
module.exports = { login, register, getUserById, updateUser, deleteUser };
