const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAdmin = require("../middleware/isAdmin");
const checkAuth = require("../middleware/checkAuth");
const categoryController = require("../controllers/categoryController");
const questionController = require("../controllers/questionController");

router.use(checkAuth, isAdmin);

router.get("/dashboard", adminController.getDashboard);
router.get("/categories", categoryController.getAllCategories);
router.post("/categories/add", categoryController.createCategory);
router.post("/categories/delete/:id", categoryController.deleteCategory);
router.post("/quiz/delete/:id", adminController.deleteQuiz);
router.get("/quiz/:quizId/questions", questionController.getQuestions);
router.post("/quiz/:quizId/questions/add", questionController.addQuestion);
router.get("/questions/edit/:id", questionController.getEditPage);
router.post("/questions/edit/:id", questionController.updateQuestion);
router.post("/questions/delete/:id", questionController.deleteQuestion);
module.exports = router;
