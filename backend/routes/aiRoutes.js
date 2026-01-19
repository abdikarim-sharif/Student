// backend/routes/aiRoutes.js
const express = require("express");
const router = express.Router();

const {
  summary,
  generateStudyNotes,
  generateAssessment,
} = require("../controllers/aiController");

// ✅ summary endpoint
router.post("/summary", summary);

// notes + summary + practice
router.post("/notes", generateStudyNotes);

// AI quiz / assessment
router.post("/assessment", generateAssessment);

module.exports = router;
