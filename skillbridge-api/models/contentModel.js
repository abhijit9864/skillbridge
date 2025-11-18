const db = require('../config/db');

class Content {
  static async getContentByCourseId(courseId) {
    const [rows] = await db.query('SELECT * FROM Content WHERE course_id = ?', [courseId]);
    return rows;
  }

  static async addContent(courseId, contentTypeId, contentUrl, version) {
    const [result] = await db.query(
      'INSERT INTO Content (course_id, content_type_id, content_url, version) VALUES (?, ?, ?, ?)',
      [courseId, contentTypeId, contentUrl, version]
    );
    return result.insertId;
  }

  static async deleteContent(contentId) {
    await db.query('DELETE FROM Content WHERE content_id = ?', [contentId]);
  }
}

module.exports = Content;