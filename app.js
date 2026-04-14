const express = require;
const path = require("path");
const db = require("./config/db");
require("doetnv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("index", {
      title: "Tietovisa - main",
      categories: categories,
    });
  } catch (error) {
    console.error("Error DB query:", error);
    res.render("index", {
      title: "Tietovisa - error",
      categories: [],
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
