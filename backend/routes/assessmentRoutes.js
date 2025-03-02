const express = require("express");
const assessSymptoms = require("../controllers/assessmentController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const db = require("../config/db.js");

const router = express.Router();

router.get("/history", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await db.execute("SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC", [userId]);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Assess symptoms
router.post("/", assessSymptoms);

module.exports = router;