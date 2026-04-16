require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/db");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("index", {
      title: "Tietovisa - Main",
      categories: categories,
    });
  } catch (error) {
    console.error("Error DB query:", error);
    res.render("index", {
      title: "Tietovisa - Error",
      categories: [],
    });
  }
});

app.get("/category/:id", async (req, res) => {
  const categoryId = req.params.id;
  try {
    const [[category]] = await db.query(
      "SELECT name FROM categories WHERE id = ?",
      [categoryId],
    );

    const [quizzes] = await db.query(
      "SELECT * FROM quizzes WHERE category_id = ?",
      [categoryId],
    );

    res.render("quiz/list", {
      title: `Category: ${category ? category.name : "Unknown"}`,
      categoryName: category ? category.name : "Unknown",
      quizzes: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/quiz/play/:id", async (req, res) => {
  const quizId = req.params.id;
  try {
    const [[quiz]] = await db.query("SELECT * FROM quizzes WHERE id = ?", [
      quizId,
    ]);
    const [questions] = await db.query(
      "SELECT * FROM questions WHERE category_id = ?",
      [quiz.category_id],
    );

    res.render("quiz/play", {
      title: `Playing: ${quiz.title}`,
      quiz: quiz,
      questions: questions,
    });
  } catch (error) {
    console.error("Error loading quiz:", error);
    res.redirect("/");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
