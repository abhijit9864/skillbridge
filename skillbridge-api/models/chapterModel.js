const db = require('../config/db');

const Chapter = {
  createChapter: async (course_id, title, description, access_setting, video_url) => {
    const query = `INSERT INTO chapter 
                    (course_id, title, description, access_setting, video_url, created_at, is_active) 
                    VALUES (?, ?, ?, ?, ?, NOW(), 1)`;
    await db.query(query, [course_id, title, description, access_setting, video_url]);
  },

  updateChapter: async (chapterId, title, description) => {
    const query = `UPDATE chapter 
                   SET title = ?, description = ?, updated_at = NOW() 
                   WHERE chapter_id = ?`;
    const [result] = await db.query(query, [title, description, chapterId]);

    if (result.affectedRows === 0) {
      throw new Error("Chapter not found");
    }
  },

  // ✅ Delete Chapter Function
  deleteChapter: async (chapterId) => {
    const query = `DELETE FROM chapter WHERE chapter_id = ?`;
    const [result] = await db.query(query, [chapterId]);

    if (result.affectedRows === 0) {
      throw new Error("Chapter not found");
    }

    return result;
  },
};

module.exports = Chapter;
