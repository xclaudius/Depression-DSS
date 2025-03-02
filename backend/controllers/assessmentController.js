const db = require("../config/db");

const assessSymptoms = async (req, res) => {
  const { responses, totalScore, severity, functionalImpairment } = req.body;

  try {
    // Save the assessment to the database (if needed)
    const [result] = await db.execute(
      "INSERT INTO assessments (user_id, score, result, functional_impairment) VALUES (?, ?, ?, ?)",
      [req.user.id, totalScore, severity, functionalImpairment]
    );

    // Return the result to the frontend
    res.status(200).json({ severity, functionalImpairment });
  } catch (error) {
    console.error("Error assessing symptoms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = assessSymptoms;
