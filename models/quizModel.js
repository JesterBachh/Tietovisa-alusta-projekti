const db = require("../config/db");

const Quiz = {
  create: async (title, categoryId, creatorId) => {
    const sql =
      "INSERT INTO quizzes (title, category_id, creator_id) VALUES (?, ?, ?)";
    return await db.query(sql, [title, categoryId, creatorId]);
  },
  delete: async (id) => {
    return await db.query("DELETE FROM quizzes WHERE id = ?", [id]);
  },
};

module.exports = Quiz;
