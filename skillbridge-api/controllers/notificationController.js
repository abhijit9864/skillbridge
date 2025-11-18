const Notification = require('../models/notification');
const db = require('../config/db'); // Import database connection

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err.message });
    }
};

// Create a notification (for all users)
const createNotification = async (req, res) => {
    try {
        const { notification_type, message } = req.body;

        // Fetch all active user IDs
        const [users] = await db.query('SELECT user_id FROM user WHERE is_active = 1');

        if (users.length === 0) {
            return res.status(400).json({ message: "No active users found" });
        }

        // Insert notifications for all users
        const values = users.map(user => [user.user_id, notification_type, message]);
        await Notification.bulkCreate(values);

        res.status(201).json({ message: "Notification sent to all users" });
    } catch (err) {
        res.status(500).json({ message: "Error creating notification", error: err.message });
    }
};

module.exports = { getNotifications, createNotification };
