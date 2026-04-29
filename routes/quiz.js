const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const resultsController = require("../controllers/resultsController");
const checkAuth = require("../middleware/checkAuth");

router.get("/make", checkAuth, quizController.getMakePage);
router.post("/make", checkAuth, quizController.postMakeQuiz);

router.get("/category/:id", quizController.getQuizzesByCategory);

router.get("/play/:id", quizController.playQuiz);

router.post("/save-score", checkAuth, resultsController.saveScore);

module.exports = router;
