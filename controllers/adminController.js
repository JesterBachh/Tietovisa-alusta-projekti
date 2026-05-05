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
  try {
    await db.query("DELETE FROM quizzes WHERE id = ?", [req.params.id]);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Error deleting quiz");
  }
};

exports.getCategories = (req, res) =>
  res.render("admin/categories", {
    title: "Manage Categories",
    user: req.session.user,
  });
