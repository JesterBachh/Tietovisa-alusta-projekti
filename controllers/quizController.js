const db = require("../config/db");

exports.getQuizzesByCategory = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      "SELECT * FROM quizzes WHERE category_id = ?",
      [req.params.id],
    );
    const [[category]] = await db.query(
      "SELECT name FROM categories WHERE id = ?",
      [req.params.id],
    );
    res.render("quiz/list", {
      quizzes,
      title: category ? category.name : "Quizzes",
      categoryName: category ? category.name : "Unknown",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.playQuiz = async (req, res) => {
  try {
    const [[quiz]] = await db.query("SELECT * FROM quizzes WHERE id = ?", [
      req.params.id,
    ]);
    const [questions] = await db.query(
      "SELECT * FROM questions WHERE quiz_id = ?",
      [req.params.id],
    );
    res.render("quiz/play", { quiz, questions, title: quiz.title });
  } catch (error) {
    res.redirect("/");
  }
};

exports.getMakePage = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("quiz/make", { categories, title: "Create Quiz" });
  } catch (error) {
    res.status(500).send("Error loading categories");
  }
};

exports.postMakeQuiz = async (req, res) => {
  const { title, category_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO quizzes (title, category_id) VALUES (?, ?)",
      [title, category_id],
    );
    res.redirect(`/quiz/make-questions/${result.insertId}`);
  } catch (error) {
    res.status(500).send("Error creating quiz");
  }
};
