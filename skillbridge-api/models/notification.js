const db = require('../config/db');

class Notification {
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM notification ORDER BY created_at DESC');
            return rows;
        } catch (err) {
            throw new Error('Database error: ' + err.message);
        }
    }

    static async create(user_id, notification_type, message) {
        try {
            const [result] = await db.query(
                'INSERT INTO notification (user_id, notification_type, message) VALUES (?, ?, ?)',
                [user_id, notification_type, message]
            );
            return result.insertId;
        } catch (err) {
            throw new Error('Database error: ' + err.message);
        }
    }

    // Insert multiple notifications at once
    static async bulkCreate(values) {
        try {
            const query = 'INSERT INTO notification (user_id, notification_type, message) VALUES ?';
            await db.query(query, [values]);
        } catch (err) {
            throw new Error('Database error: ' + err.message);
        }
    }
}

module.exports = Notification;
