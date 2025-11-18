const express = require('express');
const router = express.Router();
const { getNotifications, createNotification } = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/create', createNotification); // Changed the endpoint for clarity

module.exports = router;
