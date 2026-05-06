const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const [quizzes] = await db.query(`
      SELECT 
        quizzes.*, 
        users.username, 
        categories.name AS category_name 
      FROM quizzes 
      LEFT JOIN users ON quizzes.creator_id = users.id
      LEFT JOIN categories ON quizzes.category_id = categories.id
    `);

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      quizzes,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading dashboard");
  }
};

exports.deleteQuiz = async (req, res) => {
  const quizId = req.params.id;
  try {
    await db.query("DELETE FROM questions WHERE quiz_id = ?", [quizId]);
    await db.query("DELETE FROM quizzes WHERE id = ?", [quizId]);

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting quiz and its questions");
  }
};
