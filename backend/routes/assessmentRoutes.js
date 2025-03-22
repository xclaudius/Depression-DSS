// routes/assessmentRoutes.js
const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// Route for symptom assessment
router.post('/', assessmentController.assessSymptoms);

// Route for fetching assessment history
router.get('/history', assessmentController.getAssessmentHistory);

// ✅ Route to insert questions into the database
router.post("/insert-questions", assessmentController.insertQuestions);

// ✅ Route to fetch 10 random questions dynamically
router.get("/questions", assessmentController.getRandomQuestions);

module.exports = router;