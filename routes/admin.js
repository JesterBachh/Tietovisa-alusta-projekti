const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAdmin = require("../middleware/isAdmin");
const checkAuth = require("../middleware/checkAuth");

router.use(checkAuth, isAdmin);

router.get("/dashboard", adminController.getDashboard);
router.get("/categories", adminController.getCategories);
router.post("/quiz/delete/:id", adminController.deleteQuiz);
module.exports = router;
