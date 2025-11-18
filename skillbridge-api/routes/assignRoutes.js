const express = require("express");
const router = express.Router();
const assignController = require("../controllers/assignController"); // Ensure correct import

router.post("/", assignController.assignInstructorToCourse);
router.get("/assigned-courses", assignController.getAssignedCourses); // New Route ✅
 // "/" because it's already prefixed with "/api/assign" in server.js

module.exports = router;
