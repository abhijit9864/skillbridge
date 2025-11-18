const db = require('../config/db'); // Import DB connection

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { title, description, organization_id, visibility_setting_id, prerequisite_id, completion_criteria, is_published } = req.body;
        const courseImage = `/uploads/${req.file.filename}`;

        const [result] = await db.query(
            `INSERT INTO course (title, description, organization_id, visibility_setting_id, prerequisite_id, completion_criteria, created_at, updated_at, is_active, course_image, is_published) 
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1, ?, ?)`,
            [title, description, organization_id, visibility_setting_id, prerequisite_id, completion_criteria, courseImage, is_published]
        );

        res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all active courses
exports.getAllCourses = async (req, res) => {
    try {
        const [courses] = await db.query("SELECT * FROM course WHERE is_active = 1");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get published courses sorted by creation date
exports.getPublishedCourses = async (req, res) => {
    try {
        const [courses] = await db.query(
            `SELECT 
                c.course_id, 
                c.title, 
                c.course_image, 
                c.is_published, 
                u.user_id AS instructor_id, 
                u.full_name AS instructor_name, 
                COUNT(ch.chapter_id) AS chapter_count, 
                c.created_at
            FROM course c
            LEFT JOIN users u ON c.instructor_id = u.user_id
            LEFT JOIN chapter ch ON c.course_id = ch.course_id
            WHERE c.is_published = 1 
            GROUP BY c.course_id, u.user_id, u.full_name, c.created_at
            ORDER BY c.created_at DESC;`
        );

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const [course] = await db.query("SELECT * FROM course WHERE course_id = ? AND is_active = 1", [courseId]);

        if (course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, visibility_setting_id, prerequisite_id, completion_criteria, is_published } = req.body;
        const courseImage = req.file ? `/uploads/${req.file.filename}` : null;

        let updateQuery;
        let values;

        if (courseImage) {
            updateQuery = `UPDATE course SET title = ?, description = ?, visibility_setting_id = ?, prerequisite_id = ?, completion_criteria = ?, course_image = ?, is_published = ?, updated_at = NOW() WHERE course_id = ?`;
            values = [title, description, visibility_setting_id, prerequisite_id, completion_criteria, courseImage, is_published, courseId];
        } else {
            updateQuery = `UPDATE course SET title = ?, description = ?, visibility_setting_id = ?, prerequisite_id = ?, completion_criteria = ?, is_published = ?, updated_at = NOW() WHERE course_id = ?`;
            values = [title, description, visibility_setting_id, prerequisite_id, completion_criteria, is_published, courseId];
        }

        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const [result] = await db.query("UPDATE course SET is_active = 0 WHERE course_id = ?", [courseId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully (soft delete)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
