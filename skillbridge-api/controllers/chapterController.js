const Chapter = require('../models/chapterModel');
const { uploadVideo } = require('../config/multerConfig');  // ✅ Import correctly

const createChapter = async (req, res) => {
    try {
        const { course_id, title, description, access_setting } = req.body;
        const video_url = req.file ? `/uploads/videos/${req.file.filename}` : null;

        if (!course_id || !title || !description || !access_setting || !video_url) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await Chapter.createChapter(course_id, title, description, access_setting, video_url);
        res.status(201).json({ message: 'Chapter created successfully' });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: 'Error creating chapter', error: err.message });
    }
};

const updateChapter = async (req, res) => {
    const { chapterId } = req.params;
    const { title, description } = req.body;

    try {
        await Chapter.updateChapter(chapterId, title, description);
        res.status(200).json({ message: "Chapter updated successfully" });
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Delete Chapter Function
const deleteChapter = async (req, res) => {
    const { chapterId } = req.params;

    try {
        const result = await Chapter.deleteChapter(chapterId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createChapter, updateChapter, deleteChapter, uploadVideo };  // ✅ Export deleteChapter
