require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
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

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

const db = require("./config/db");
app.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("index", {
      title: "Tietovisa - Main",
      categories: categories,
    });
  } catch (error) {
    console.error("Error DB query:", error);
    res.render("index", { title: "Tietovisa - Error", categories: [] });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
