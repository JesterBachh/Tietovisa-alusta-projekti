const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");

router.get("/register", (req, res) =>
  res.render("auth/register", { title: "Register" }),
);
router.get("/login", (req, res) =>
  res.render("auth/login", { title: "Login" }),
);

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.redirect("/auth/login");
  } catch (error) {
    res.send("User already exists or DB error.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  if (users.length > 0) {
    const user = users[0];
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      return res.redirect("/auth/profile");
    }
  }
  res.send("Invalid credentials.");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

router.get("/profile", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  const [scores] = await db.query(
    "SELECT scores.*, quizzes.title FROM scores JOIN quizzes ON scores.quiz_id = quizzes.id WHERE scores.user_id = ? ORDER BY played_at DESC",
    [req.session.user.id],
  );
  res.render("auth/profile", { title: "My Profile", scores });
});

module.exports = router;
