const db = require("../config/db"); // Import DB connection

// ✅ Create a new course (Default: is_published = 1)
exports.createCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, organization_id } = req.body;
    const orgId = organization_id || 1; // Default organization ID if not provided
    const courseImage = `/uploads/course-images/${req.file.filename}`;

    const [result] = await db.query(
      "INSERT INTO course (title, description, organization_id, course_image, is_published) VALUES (?, ?, ?, ?, 1)",
      [title, description, orgId, courseImage]
    );

    res.status(201).json({
      message: "Course created successfully",
      courseId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all courses with chapter count
exports.getAllCourses = async (req, res) => {
  try {
    const query = `
            SELECT 
    c.course_id, 
    c.title, 
    c.course_image, 
    c.is_published, 
    u.user_id AS instructor_id, 
    u.name AS instructor_name, 
    (SELECT COUNT(*) 
     FROM chapter ch 
     WHERE ch.course_id = c.course_id 
       AND ch.is_active = 1) AS chapter_count
FROM course c
LEFT JOIN course_assignment ca ON c.course_id = ca.course_id
LEFT JOIN user u ON ca.instructor_id = u.user_id   `;

    const [courses] = await db.query(query);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [course] = await db.query(
      "SELECT course_id, title, description, course_image, is_published FROM course WHERE course_id = ?",
      [courseId]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course[0]);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a course (Allows toggling is_published)
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, is_published } = req.body;
    const courseImage = req.file
      ? `/uploads/course-images/${req.file.filename}`
      : null;

    let updateQuery;
    let values;

    if (courseImage) {
      updateQuery =
        "UPDATE course SET title = ?, description = ?, course_image = ?, is_published = ? WHERE course_id = ?";
      values = [title, description, courseImage, is_published, courseId];
    } else {
      updateQuery =
        "UPDATE course SET title = ?, description = ?, is_published = ? WHERE course_id = ?";
      values = [title, description, is_published, courseId];
    }

    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Toggle course publish status
exports.toggleCoursePublishStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get current publish status
    const [course] = await db.query(
      "SELECT is_published FROM course WHERE course_id = ?",
      [courseId]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newStatus = course[0].is_published === 1 ? 0 : 1;

    // Update publish status
    await db.query("UPDATE course SET is_published = ? WHERE course_id = ?", [
      newStatus,
      courseId,
    ]);

    res.status(200).json({
      message: `Course ${
        newStatus === 1 ? "published" : "unpublished"
      } successfully`,
    });
  } catch (error) {
    console.error("Error toggling course publish status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [result] = await db.query("DELETE FROM course WHERE course_id = ?", [
      courseId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
};
