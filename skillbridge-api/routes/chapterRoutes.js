const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');

// Route for creating a chapter with video upload
router.post('/', chapterController.uploadVideo.single('video'), chapterController.createChapter);
router.put("/chapters/:chapterId", chapterController.updateChapter);
router.delete('/chapters/:chapterId', chapterController.deleteChapter);

module.exports = router;
