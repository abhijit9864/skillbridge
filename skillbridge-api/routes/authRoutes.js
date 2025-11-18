
const express = require('express');
const router = express.Router();
const { login, register, getUserById, updateUser, deleteUser } = require('../controllers/authController'); // Ensure correct import

// Define authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
