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
    console.error(error);
    res.send("User already exists or DB error.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
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
        return res.redirect("/");
      }
    }
    res.send("Invalid credentials.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Login error occurred");
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

router.get("/profile", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  try {
    const [results] = await db.query(
      `SELECT ur.*, q.title 
       FROM user_results ur 
       JOIN quizzes q ON ur.quiz_id = q.id 
       WHERE ur.user_id = ? 
       ORDER BY ur.completed_at DESC`,
      [req.session.user.id],
    );

    res.render("auth/profile", {
      title: "My Profile",
      user: req.session.user,
      results: results,
    });
  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    res.status(500).send("Error loading profile");
  }
});

module.exports = router;
