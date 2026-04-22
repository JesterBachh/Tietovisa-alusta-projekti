require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

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

// Auth routes

app.get("/register", (req, res) =>
  res.render("auth/register", { title: "Register" }),
);
app.get("/login", (req, res) => res.render("auth/login", { title: "Login" }));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering:", error);
    res.send("User already exists or DB error.");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        return res.redirect("/");
      }
    }
    res.send("Invalid username or password.");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login error occurred");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.post("/quiz/submit/:id", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  const { quiz_id, score, total_questions } = req.body;
  try {
    await db.query(
      "INSERT INTO scores (user_id, quiz_id, score, total_questions) VALUES ( ?, ?, ?, ?)",
      [req.session.user.id, quiz_id, score, total_questions],
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

app.get("/profile", async (req,res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const [myScores] = await db.query(
      `SELECT scores.*, quizzes.title
      FROM scores
      JOIN quizzes ON scores.quiz_id = quizzes.id
      WHERE scores.user_id = ?
      ORDER BY played_at DESC`,
      [req.session.user.id]
    );
    res.render("auth/profile", { title: "My Profile", scores: myScores});
  } catch(err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
