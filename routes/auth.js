const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel"); 

router.get("/register", (req, res) =>
  res.render("auth/register", { title: "Register" })
);

router.get("/login", (req, res) =>
  res.render("auth/login", { title: "Login" })
);

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create(username, hashedPassword);
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Registration error: User might already exist.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      return req.session.save((err) => {
        if (err) return res.status(500).send("Session error");
        res.redirect("/");
      });
    }
    res.status(401).send("Invalid credentials.");
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
    const results = await User.getResults(req.session.user.id);
    res.render("auth/profile", {
      title: "My Profile",
      user: req.session.user,
      results: results,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).send("Error loading profile");
  }
});

module.exports = router;