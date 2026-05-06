const db = require("../config/db");

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("admin/categories", {
      title: "Manage Categories",
      categories: categories,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading categories");
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(500).send("Error creating category");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const [linkedQuizzes] = await db.query(
      "SELECT id FROM quizzes WHERE category_id = ?",
      [req.params.id],
    );

    if (linkedQuizzes.length > 0) {
      return res
        .status(400)
        .send("You cannot delete this category because there are quizzes.");
    }

    await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.redirect("/admin/categories");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting category.");
  }
};
