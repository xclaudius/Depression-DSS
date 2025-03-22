// controllers/assessmentController.js
const db = require("../config/db");
const mlService = require("../services/mlService"); // Only import once

const assessSymptoms = async (req, res) => {
  const { responses, totalScore } = req.body;

  try {
    // Get ML prediction
    const prediction = await mlService.predictSeverity(responses);

    // Use the ML prediction for severity
    const severity = prediction.severity;
    const confidence = prediction.confidence || 0;
    const predictionMethod = prediction.method || 'ml';

    // Extract functional impairment from the responses
    const functionalImpairment = req.body.functionalImpairment || 'Not specified';

    // Save the assessment to the database with ML prediction details
    const [result] = await db.execute(
      "INSERT INTO assessments (user_id, score, result, functional_impairment, confidence, prediction_method) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, totalScore, severity, functionalImpairment, confidence, predictionMethod]
    );

    // Return the result to the frontend with additional ML information
    res.status(200).json({
      severity,
      functionalImpairment,
      confidence,
      predictionMethod,
      assessmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error assessing symptoms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get assessment history for a user
const getAssessmentHistory = async (req, res) => {
  try {
    const [assessments] = await db.execute(
      "SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessment history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Insert PHQ-9 Questions into the Database
const insertQuestions = async (req, res) => {
  try {
      const questions = [
        ["Little interest or pleasure in doing things?", "PHQ-9", "phq9"],
["Feeling down, depressed, or hopeless?", "PHQ-9", "phq9"],
["Trouble falling or staying asleep, or sleeping too much?", "PHQ-9", "phq9"],
["Feeling tired or having little energy?", "PHQ-9", "phq9"],
["Poor appetite or overeating?", "PHQ-9", "phq9"],
["Feeling bad about yourself—or that you are a failure?", "PHQ-9", "yesno" ],
["Trouble concentrating on things, such as reading or watching TV?", "PHQ-9", "phq9"],
["Moving or speaking slowly, or being so fidgety that people notice?", "PHQ-9", "phq9"],
["Thoughts that you would be better off dead, or hurting yourself?", "PHQ-9","yesno"],
["Have you ever been diagnosed with depression in the past?", "Medical History", "yesno"],
["Do you struggle to get out of bed in the morning?", "PHQ-9", "phq9"],
["Do you avoid responsibilities or daily tasks?", "PHQ-9", "phq9"],
["Do you feel emotionally numb or disconnected?", "PHQ-9", "phq9"],
["Have you lost interest in personal hygiene or self-care?", "PHQ-9", "phq9"],
["Do you feel restless, fidgety, or unable to sit still?", "PHQ-9", "phq9"],
["Have you noticed significant weight gain or loss recently?", "PHQ-9", "yesno"],
["Do you feel lonely, even when around people?", "PHQ-9", "yesno"],
["Do you experience difficulty concentrating at work or school?", "PHQ-9", "phq9"],
["Have you been feeling more fatigued than usual, even after resting?", "PHQ-9", "phq9"],
["Do you feel like you're moving or thinking slower than usual?", "PHQ-9", "phq9"],
["Have you had frequent mood swings or unexpected emotional outbursts?", "PHQ-9", "phq9"],
["Do you feel hopeless about the future?", "PHQ-9", "yesno"],
["Have you been isolating yourself from family and friends?", "PHQ-9", "phq9"],
["Do you feel guilty or ashamed about things beyond your control?", "PHQ-9", "phq9"],
["Do you experience frequent body pain, headaches, or stomach issues?", "Physical Symptoms", "yesno"],
["Do you feel anxious or worried more than usual?", "PHQ-9", "phq9"],
["Do you struggle to express your emotions?", "Emotional", "yesno"],
["Have you been relying on alcohol or drugs to manage your mood?", "Substance Use", "yesno"],
["Do you feel safe at home?", "Emotional", "yesno"],
["Are you experiencing financial stress that impacts your mood?", "Stress", "yesno"],
["Have you had significant changes in your personal relationships?", "Social", "yesno"],
["Do you feel like you are being a burden to others?", "Guilt", "yesno"],
["Do you find yourself overthinking negative experiences?", "Cognition", "yesno"],
["Have you recently experienced a major loss [e.g., job, loved one]?", "Life Events", "yesno"],
["Do you feel unable to control worrying thoughts?", "Anxiety", "yesno"],
["Do you avoid social situations due to low mood or anxiety?", "Social", "yesno"],
["Have you been more sensitive to criticism than usual?", "Self-esteem", "yesno"],
["Do you feel like your emotions fluctuate frequently?", "Mood", "yesno"],
["Do you have difficulty finding enjoyment in hobbies?", "Interest Loss", "phq9"],
["Have you experienced a decrease in work or school performance?", "Cognition", "yesno"],
["Have you been sleeping too much or too little?", "Sleep", "phq9"],
["Do you feel overwhelmed even by small tasks?", "Stress", "phq9"],
["Do you feel like you have no purpose in life?", "Depression", "yesno"],
["Do you feel like life is meaningless?", "Depression", "yesno"]
      ];

      // Insert into database
      const sql = "INSERT INTO questions (text, category, response_type) VALUES ?";
      await db.query(sql, [questions]);

      res.status(200).json({ message: "Questions inserted successfully" });
  } catch (error) {
      console.error("Database Insert Error:", error);
      res.status(500).json({ error: "Failed to insert questions" });
  }
};

// ✅ Fetch 10 Random Questions for the Assessment
const getRandomQuestions = async (req, res) => {
  try {
      const [questions] = await db.execute("SELECT * FROM questions ORDER BY RAND() LIMIT 10");
      res.status(200).json(questions);
  } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  assessSymptoms,
  getAssessmentHistory,
  insertQuestions, getRandomQuestions
};