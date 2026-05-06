const db = require("../config/db");

const Result = {
  add: async (userId, quizId, score, total) => {
    return await db.query(
      "INSERT INTO user_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)",
      [userId, quizId, score, total],
    );
  },
};

module.exports = Result;
