const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/:id", quizController.getQuizzesByCategory);

module.exports = router;
