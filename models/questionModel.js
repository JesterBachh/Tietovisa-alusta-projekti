const db = require("../config/db");

const Question = {
  create: async (quizId, categoryId, text, correct, options) => {
    return await db.query(
      "INSERT INTO questions (quiz_id, category_id, question_text, correct_answer, options) VALUES (?, ?, ?, ?, ?)",
      [quizId, categoryId, text, correct, JSON.stringify(options)],
    );
  },

  getByQuiz: async (quizId) => {
    const [rows] = await db.query("SELECT * FROM questions WHERE quiz_id = ?", [
      quizId,
    ]);
    return rows;
  },
};

module.exports = Question;
