const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Fetch user progress for all chapters in a course
router.get("/:courseId/chapters/progress/:userId", async (req, res) => {
    const { courseId, userId } = req.params;
    try {
        const [progress] = await pool.query(
            "SELECT * FROM chapter_progress WHERE course_id = ? AND user_id = ?",
            [courseId, userId]
        );
        res.json({ progress });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// Update chapter progress
router.post('/progress', async (req, res) => {
    const { user_id, course_id, chapter_id, progress } = req.body;

    try {
        // 🔍 Check if the course exists
        const [courseCheck] = await pool.query(
            "SELECT course_id FROM course WHERE course_id = ?",
            [course_id]
        );

        if (courseCheck.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid course_id. Course does not exist."
            });
        }

        // 🔍 Check if the chapter exists
        const [chapterCheck] = await pool.query(
            "SELECT chapter_id FROM chapter WHERE chapter_id = ? AND course_id = ?",
            [chapter_id, course_id]
        );

        if (chapterCheck.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid chapter_id. Chapter does not exist for this course."
            });
        }

        // 🔍 Check if progress entry exists
        const [existing] = await pool.query(
            "SELECT * FROM chapter_progress WHERE user_id = ? AND course_id = ? AND chapter_id = ?",
            [user_id, course_id, chapter_id]
        );

        if (existing.length === 0) {
            // 🆕 Insert if entry doesn't exist
            await pool.query(
                "INSERT INTO chapter_progress (user_id, course_id, chapter_id, progress, unlocked, completed) VALUES (?, ?, ?, ?, 0, 0)",
                [user_id, course_id, chapter_id, progress]
            );
            console.log("Inserted new progress record.");
        } else {
            // 🔄 Update existing progress
            await pool.query(
                "UPDATE chapter_progress SET progress = ? WHERE user_id = ? AND course_id = ? AND chapter_id = ?",
                [progress, user_id, course_id, chapter_id]
            );
            console.log("Updated existing progress record.");
        }

        res.json({ success: true, message: "Progress updated" });

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get unlocked chapters for user
router.get('/unlocked/:user_id/:course_id', async (req, res) => {
    const { user_id, course_id } = req.params;

    try {
        const [chapters] = await pool.query(
            "SELECT c.* FROM chapter c JOIN chapter_progress cp ON c.chapter_id = cp.chapter_id WHERE cp.user_id = ? AND cp.course_id = ? AND cp.unlocked = 1",
            [user_id, course_id]
        );

        res.json({ success: true, data: chapters });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save video playback position
router.post('/savePlaybackPosition', async (req, res) => {
    const { user_id, course_id, chapter_id, playback_position } = req.body;

    try {
        await pool.query(
            "INSERT INTO video_playback (user_id, course_id, chapter_id, playback_position) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE playback_position = ?",
            [user_id, course_id, chapter_id, playback_position, playback_position]
        );
        res.json({ success: true, message: "Playback position saved" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Retrieve video playback position
router.get('/getPlaybackPosition/:user_id/:course_id/:chapter_id', async (req, res) => {
    const { user_id, course_id, chapter_id } = req.params;

    try {
        const [result] = await pool.query(
            "SELECT playback_position FROM video_playback WHERE user_id = ? AND course_id = ? AND chapter_id = ?",
            [user_id, course_id, chapter_id]
        );
        res.json({ success: true, playback_position: result[0]?.playback_position || 0 });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
