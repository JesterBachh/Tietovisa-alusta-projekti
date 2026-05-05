const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, hashedPassword],
    );
    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).send("Registration error: " + error.message);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send("Login error");
  }
};

exports.getProfile = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  try {
    const userId = req.session.user.id;

    const [myQuizzes] = await db.query(
      "SELECT * FROM quizzes WHERE creator_id = ? ORDER BY id DESC",
      [userId],
    );

    res.render("auth/profile", {
      user: req.session.user,
      results: [],
      myQuizzes: myQuizzes,
      title: "My Profile",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Profile Error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
