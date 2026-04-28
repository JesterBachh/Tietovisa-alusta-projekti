const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const checkAuth = require("../middleware/checkAuth");

router.get("/make", checkAuth, quizController.getMakePage);
router.post("/make", checkAuth, quizController.postMakeQuiz);

router.get("/category/:id", quizController.getQuizzesByCategory);
router.get("/play/:id", quizController.playQuiz);

router.get("/make", quizController.getMakePage);
router.post("/make", quizController.postMakeQuiz);

module.exports = router;
