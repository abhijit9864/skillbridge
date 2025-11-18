const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const courseController = require("../controllers/courseController");
const { uploadImage } = require("../config/multerConfig");

// Course Management Routes
router.post("/", uploadImage.single("courseImage"), courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:courseId", courseController.getCourseById);
router.put("/:courseId", uploadImage.single("courseImage"), courseController.updateCourse);
router.delete("/:courseId", courseController.deleteCourse);

// ✅ New route to update course status (publish/unpublish)
router.put("/:courseId/status", async (req, res) => {
    const { courseId } = req.params;
    const { status } = req.body;
    const isPublished = status === "published" ? 1 : 0;

    try {
        await pool.execute("UPDATE course SET is_published = ? WHERE course_id = ?", [isPublished, courseId]);
        res.json({ message: `Course ${isPublished ? "Published" : "Unpublished"} successfully.` });
    } catch (error) {
        console.error("Error updating course status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get course details along with its chapters
router.get("/:courseId/chapters", async (req, res) => {
    const { courseId } = req.params;

    try {
        // Fetch course details
        const [course] = await pool.execute("SELECT title FROM course WHERE course_id = ?", [courseId]);

        if (course.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Fetch all chapters for the course
        const [chapters] = await pool.execute(
            "SELECT chapter_id, title, description, video_url, access_setting FROM chapter WHERE course_id = ? AND is_active = 1",
            [courseId]
        );

        res.json({
            course_name: course[0].title,
            chapters: chapters.length > 0 ? chapters : "No chapters available",
        });
    } catch (error) {
        console.error("Error fetching course & chapters:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Route to rename a course
router.put("/:courseId/rename", async (req, res) => {
    const { courseId } = req.params;
    const { title } = req.body;

    try {
        const [result] = await pool.execute("UPDATE course SET title = ?, updated_at = NOW() WHERE course_id = ?", [title, courseId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course renamed successfully" });
    } catch (error) {
        console.error("Error renaming course:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
