const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createAssessment,
  getAssessmentsByCourse,
  getAssessment,
} = require("../controllers/assessmentController");
const {
  submitAssessment,
  getSubmissionsForAssessment,
  getSubmission,
} = require("../controllers/submissionController");

// lecturer creates assessment for course
router.post(
  "/courses/:courseId",
  protect,
  requireRole("lecturer", "admin"),
  createAssessment
);

// list assessments for a course
router.get("/courses/:courseId", protect, getAssessmentsByCourse);

// assessment detail
router.get("/:id", protect, getAssessment);

// student submits
router.post("/:id/submit", protect, requireRole("student"), submitAssessment);

// lecturer views submissions
router.get("/:id/submissions", protect, requireRole("lecturer", "admin"), getSubmissionsForAssessment);

// single submission
router.get("/submission/:id", protect, getSubmission);

module.exports = router;
