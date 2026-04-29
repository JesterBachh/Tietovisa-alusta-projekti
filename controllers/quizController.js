const db = require("../config/db");

exports.getQuizzesByCategory = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      "SELECT * FROM quizzes WHERE category_id = ?",
      [req.params.id],
    );
    const [[category]] = await db.query(
      "SELECT name FROM categories WHERE id = ?",
      [req.params.id],
    );
    res.render("quiz/list", {
      quizzes,
      title: category ? category.name : "Quizzes",
      categoryName: category ? category.name : "Unknown",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.playQuiz = async (req, res) => {
  try {
    console.log("Trying to open quiz with ID:", req.params.id);

    const [[quiz]] = await db.query("SELECT * FROM quizzes WHERE id = ?", [
      req.params.id,
    ]);
    if (!quiz) {
      console.log("Quiz not found!");
      return res.redirect("/");
    }

    const [questions] = await db.query(
      "SELECT * FROM questions WHERE quiz_id = ?",
      [req.params.id],
    );

    console.log("Found questions:", questions.length);

    res.render("quiz/play", { quiz, questions, title: quiz.title });
  } catch (error) {
    console.error("ERROR PLAYING QUIZ:", error);
    res
      .status(500)
      .send("Error occurred while loading the game: " + error.message);
  }
};

exports.getMakePage = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.render("quiz/make", {
      categories,
      title: "Create Quiz",
      query: req.query || {},
    });
  } catch (error) {
    console.error("Error in getMakePage:", error);
    res.redirect("/");
  }
};

exports.postMakeQuiz = async (req, res) => {
  const {
    title,
    category_id,
    question_text,
    options,
    correct_answer_index,
    quiz_id,
    action,
  } = req.body;

  const creator_id = req.session.user ? req.session.user.id : null;

  try {
    let currentQuizId = quiz_id;

    if (!currentQuizId) {
      const [quizResult] = await db.query(
        "INSERT INTO quizzes (title, category_id, creator_id) VALUES (?, ?, ?)",
        [title, category_id, creator_id],
      );
      currentQuizId = quizResult.insertId;
    }

    const correctAnswerText = options[parseInt(correct_answer_index)];
    await db.query(
      "INSERT INTO questions (quiz_id, category_id, question_text, correct_answer, options) VALUES (?, ?, ?, ?, ?)",
      [
        currentQuizId,
        category_id,
        question_text,
        correctAnswerText,
        JSON.stringify(options),
      ],
    );

    if (action === "next") {
      res.redirect(
        `/quiz/make?quiz_id=${currentQuizId}&category_id=${category_id}`,
      );
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error occurred while saving the quiz/question:", error);
    res.status(500).send("Database Error");
  }
};
