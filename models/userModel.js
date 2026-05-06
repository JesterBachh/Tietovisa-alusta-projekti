const db = require("../config/db");

const User = {
  findByUsername: async (username) => {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  },

  create: async (username, hashedPassword) => {
    return await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, hashedPassword],
    );
  },

  getResults: async (userId) => {
    const [rows] = await db.query(
      `SELECT ur.*, q.title 
       FROM user_results ur 
       JOIN quizzes q ON ur.quiz_id = q.id 
       WHERE ur.user_id = ? 
       ORDER BY ur.completed_at DESC`,
      [userId],
    );
    return rows;
  },
};

module.exports = User;
