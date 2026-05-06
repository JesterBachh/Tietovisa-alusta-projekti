const db = require("../config/db");

exports.getQuestions = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const [quizzes] = await db.query("SELECT * FROM quizzes WHERE id = ?", [
      quizId,
    ]);
    const [questions] = await db.query(
      "SELECT * FROM questions WHERE quiz_id = ?",
      [quizId],
    );

    res.render("admin/questions", {
      title: "Manage Questions",
      quiz: quizzes[0],
      questions: questions,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send("Error loading questions");
  }
};

exports.addQuestion = async (req, res) => {
  const { question_text, correct_answer, options } = req.body;
  const quizId = req.params.quizId;
  try {
    await db.query(
      "INSERT INTO questions (quiz_id, question_text, correct_answer, options) VALUES (?, ?, ?, ?)",
      [quizId, question_text, correct_answer, JSON.stringify(options)],
    );
    res.redirect(`/admin/quiz/${quizId}/questions`);
  } catch (error) {
    res.status(500).send("Error adding question");
  }
};

exports.getEditPage = async (req, res) => {
  try {
    const [questions] = await db.query("SELECT * FROM questions WHERE id = ?", [
      req.params.id,
    ]);
    const question = questions[0];
    if (!question) return res.redirect("/admin/dashboard");

    res.render("admin/edit-question", {
      title: "Edit Question",
      question: question,
      options: JSON.parse(question.options),
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send("Error loading edit page");
  }
};

exports.updateQuestion = async (req, res) => {
  const { question_text, correct_answer, options } = req.body;
  try {
    await db.query(
      "UPDATE questions SET question_text = ?, correct_answer = ?, options = ? WHERE id = ?",
      [question_text, correct_answer, JSON.stringify(options), req.params.id],
    );
    const [q] = await db.query("SELECT quiz_id FROM questions WHERE id = ?", [
      req.params.id,
    ]);
    res.redirect(`/admin/quiz/${q[0].quiz_id}/questions`);
  } catch (error) {
    res.status(500).send("Error updating question");
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const [q] = await db.query("SELECT quiz_id FROM questions WHERE id = ?", [
      req.params.id,
    ]);
    await db.query("DELETE FROM questions WHERE id = ?", [req.params.id]);
    res.redirect(`/admin/quiz/${q[0].quiz_id}/questions`);
  } catch (error) {
    res.status(500).send("Error deleting question");
  }
};
