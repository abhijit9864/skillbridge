const db = require('../config/db');

const getAssignedCourses = async (req, res) => {
    try {
        const [courses] = await db.execute(`
            SELECT c.course_id, c.title, c.is_published, 
                   u.user_id AS instructor_id, u.name AS instructor_name
            FROM course c   -- ✅ Use 'course' (not 'courses')
            LEFT JOIN course_assignment ca ON c.course_id = ca.course_id
            LEFT JOIN users u ON ca.instructor_id = u.user_id;
        `);

        res.json({ assigned_courses: courses });
    } catch (error) {
        console.error("Error fetching assigned courses:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


// Function to get all assignments (if needed elsewhere)
const getAssignments = async () => {
    try {
        const [rows] = await db.execute(`SELECT * FROM course_assignment`);
        return rows;
    } catch (error) {
        console.error("Error fetching assignments:", error);
        throw error;
    }
};

// Export functions properly
module.exports = { getAssignedCourses, getAssignments };
