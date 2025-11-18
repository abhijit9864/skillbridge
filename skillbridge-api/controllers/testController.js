const db = require("../config/db");

// Add a test question
exports.addQuestion = async (req, res) => {
  console.log("Incoming request body:", req.body);
  const { course_id, question, options, correct_option } = req.body;

  // Validate input
  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required." });
  }

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  if (!Array.isArray(options)) {
    return res.status(400).json({ error: "Options must be an array." });
  }

  if (options.length < 2) {
    return res
      .status(400)
      .json({ error: "Minimum 2 unique options required." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert question first to get question_id
    const [questionResult] = await connection.execute(
      "INSERT INTO test_questions (course_id, question, correct_option_id) VALUES (?, ?, NULL)",
      [course_id, question]
    );

    const question_id = questionResult.insertId;

    // Insert options using the obtained question_id
    // let correct_option_id = null;
    for (const [index, option_text] of options.entries()) {
      const [optionResult] = await connection.execute(
        "INSERT INTO test_options (question_id, option_text) VALUES (?, ?)",
        [question_id, option_text]
      );

      if (index === correct_option) {
        correct_option_id = optionResult.insertId;
      }
    }

    if (correct_option_id === null) {
      return res
        .status(400)
        .json({ error: "Valid correct option must be provided." });
    }

    // Update question with correct_option_id
    await connection.execute(
      "UPDATE test_questions SET correct_option_id = ? WHERE question_id = ?",
      [correct_option_id, question_id]
    );

    await connection.commit();
    res
      .status(201)
      .json({ message: "Question added successfully", question_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Update a test question
exports.updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const { question, options, correct_option } = req.body;

  if (!question_id) {
    return res.status(400).json({ error: "Question ID is required." });
  }

  if (question && question.trim() === "") {
    return res.status(400).json({ error: "Question cannot be empty." });
  }

  if (options && (!Array.isArray(options) || options.length < 2)) {
    return res
      .status(400)
      .json({ error: "Minimum 2 unique options required." });
  }

  if (
    correct_option !== undefined &&
    (correct_option < 0 || correct_option >= (options ? options.length : 0))
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid correct_option index. It must be within the range of options provided.",
      });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Update question text
    if (question) {
      await connection.execute(
        "UPDATE test_questions SET question = ? WHERE question_id = ?",
        [question, question_id]
      );
    }

    // Update options
    if (options && options.length >= 2) {
      await connection.execute(
        "DELETE FROM test_options WHERE question_id = ?",
        [question_id]
      );

      for (const [index, option_text] of options.entries()) {
        const [optionResult] = await connection.execute(
          "INSERT INTO test_options (question_id, option_text) VALUES (?, ?)",
          [question_id, option_text]
        );

        if (index === correct_option) {
          correct_option_id = optionResult.insertId;
        }
      }

      if (correct_option === null) {
        return res
          .status(400)
          .json({ error: "Valid correct option must be provided." });
      }

      if (correct_option !== null) {
        await connection.execute(
          "UPDATE test_questions SET correct_option_id = ? WHERE question_id = ?",
          [correct_option_id, question_id]
        );
      }
    }

    await connection.commit();
    res.json({ message: "Question updated successfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Get test questions for a course
exports.getTestQuestions = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required." });
  }

  try {
    const [questions] = await db.execute(
      "SELECT question_id, question, correct_option_id FROM test_questions WHERE course_id = ?",
      [course_id]
    );

    for (const q of questions) {
      const [options] = await db.execute(
        "SELECT option_id, option_text FROM test_options WHERE question_id = ?",
        [q.question_id]
      );
      q.options = options;
    }

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit test answers
exports.submitTest = async (req, res) => {
  const { user_id, course_id, answers } = req.body;

  // Validate input
  if (!user_id || !course_id || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  let totalScore = 0; // Keep track of total score
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const { question_id, option_id } of answers) {
      // Fetch correct answer from the database
      const [correct] = await connection.execute(
        "SELECT correct_option_id FROM test_questions WHERE question_id = ?",
        [question_id]
      );

      if (correct.length === 0) {
        return res.status(404).json({ error: `Question ID ${question_id} not found.` });
      }

      let score = correct[0].correct_option_id === option_id ? 1 : 0;
      totalScore += score;

      // Store attempt
      await connection.execute(
        "INSERT INTO test_attempts (user_id, course_id, score) VALUES (?, ?, ?)",
        [user_id, course_id, score]
      );
    }

    await connection.commit();

    res.json({
      message: "Test submitted successfully",
      totalScore,
      passed: totalScore >= 10, // Assuming 10 is the pass mark
    });

  } catch (err) {
    await connection.rollback();
    console.log(err);
    res.status(500).json({ error: err.message });

  } finally {
    connection.release();
  }
};



// Get test attempts (Admin)
exports.getTestAttempts = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required." });
  }

  try {
    const [attempts] = await db.execute(
      `SELECT a.attempt_id, u.username, a.score, a.passed, a.attempted_at 
             FROM test_attempts a 
             JOIN users u ON a.user_id = u.user_id 
             WHERE a.course_id = ?`,
      [course_id]
    );

    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a test question
exports.deleteQuestion = async (req, res) => {
    const { question_id } = req.params;
  
    if (!question_id) {
      return res.status(400).json({ error: "Question ID is required." });
    }
  
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
  
      // Delete options first to maintain referential integrity
      await connection.execute("DELETE FROM test_options WHERE question_id = ?", [question_id]);
  
      // Delete the question
      const [result] = await connection.execute("DELETE FROM test_questions WHERE question_id = ?", [question_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Question not found." });
      }
  
      await connection.commit();
      res.json({ message: "Question deleted successfully." });
    } catch (err) {
      await connection.rollback();
      res.status(500).json({ error: err.message });
    } finally {
      connection.release();
    }
  };
  