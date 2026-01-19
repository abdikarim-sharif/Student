const express = require("express");
const router = express.Router();
const { createCourse, getCourses, enrollStudent } = require("../controllers/courseController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.post("/", protect, requireRole("lecturer", "admin"), createCourse);
router.get("/", protect, getCourses);
router.post("/:courseId/enroll", protect, requireRole("student"), enrollStudent);

module.exports = router;
