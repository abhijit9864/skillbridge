const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.post("/questions", testController.addQuestion);
router.put("/questions/:question_id", testController.updateQuestion);
router.get("/questions/:course_id", testController.getTestQuestions);
router.post("/submit", testController.submitTest);
router.get("/attempts/:course_id", testController.getTestAttempts);
router.delete("/questions/:question_id", testController.deleteQuestion);
module.exports = router;
