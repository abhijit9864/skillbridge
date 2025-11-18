const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get reviews for a specific chapter
router.get("/reviews/:chapterId", async (req, res) => {
    const { chapterId } = req.params;
    try {
        const [reviews] = await db.execute("SELECT * FROM reviews WHERE chapter_id = ?", [chapterId]);
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// Add a new review
router.post("/reviews/:chapterId", async (req, res) => {
  const { chapterId } = req.params;
  const { user_id, rating, comment } = req.body;

  console.log("The chapterId is", chapterId);
  console.log("The request data coming from the frontend is", user_id, rating, comment);

  if (!user_id || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user exists in the 'user' table
    const [userCheck] = await db.execute("SELECT user_id FROM user WHERE user_id = ?", [user_id]);
    if (userCheck.length === 0) {
      return res.status(400).json({ error: `User ID ${user_id} does not exist` });
    }

    // Check if the chapter exists in the 'chapter' table
    const [chapterCheck] = await db.execute("SELECT chapter_id FROM chapter WHERE chapter_id = ?", [chapterId]);
    if (chapterCheck.length === 0) {
      return res.status(400).json({ error: `Chapter ID ${chapterId} does not exist` });
    }

    // Insert review if checks pass
    await db.execute(
      "INSERT INTO reviews (chapter_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [chapterId, user_id, rating, comment]
    );

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("SQL Error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});


module.exports = router;
