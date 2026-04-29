exports.saveScore = async (req, res) => {
  const { quiz_id, score, total_questions } = req.body;
  const user_id = req.session.user ? req.session.user.id : null;

  if (!user_id) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id, score FROM user_results WHERE user_id = ? AND quiz_id = ?",
      [user_id, quiz_id],
    );

    if (existing.length > 0) {
      if (score > existing[0].score) {
        await db.query(
          "UPDATE user_results SET score = ?, total_questions = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?",
          [score, total_questions, existing[0].id],
        );
        return res.json({ status: "success", message: "New highscore saved!" });
      } else {
        return res.json({
          status: "success",
          message: "Old score was better. Not updated.",
        });
      }
    } else {
      await db.query(
        "INSERT INTO user_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)",
        [user_id, quiz_id, score, total_questions],
      );
      return res.json({ status: "success", message: "First result saved!" });
    }
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: "Database error" });
  }
};
