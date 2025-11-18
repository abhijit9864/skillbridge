const pool = require("../config/db"); // Ensure correct database connection

const assignInstructorToCourse = async (req, res) => {
    try {
        const { instructor_id, course_id } = req.body;

        if (!instructor_id || !course_id) {
            return res.status(400).json({ error: "Instructor ID and Course ID are required" });
        }

        const [result] = await pool.execute(
            "INSERT INTO course_assignment (instructor_id, course_id) VALUES (?, ?)",
            [instructor_id, course_id]
        );

        res.status(201).json({ message: "Instructor assigned successfully", result });
    } catch (error) {
        console.error("Error assigning instructor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Move this function **outside** of `assignInstructorToCourse`
const getAssignedCourses = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT c.course_id, c.title, c.is_published, 
                   u.user_id AS instructor_id, u.name AS instructor_name
            FROM course c 
            LEFT JOIN course_assignment ca ON c.course_id = ca.course_id
            LEFT JOIN user u ON ca.instructor_id = u.user_id;
        `);

        res.json(rows);
    } catch (error) {
        console.error("Error fetching assigned courses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { assignInstructorToCourse, getAssignedCourses };
