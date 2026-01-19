const Assessment = require("../models/Assessment");
const Course = require("../models/Course");

exports.createAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, type, startTime, endTime, durationMinutes, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Ensure logged-in lecturer owns this course
    if (course.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your course" });
    }

    const assessment = await Assessment.create({
      course: courseId,
      title,
      description,
      type,
      startTime,
      endTime,
      durationMinutes,
      questions,
    });

    res.status(201).json(assessment);
  } catch (err) {
    console.error("Create assessment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAssessmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assessments = await Assessment.find({ course: courseId });
    res.json(assessments);
  } catch (err) {
    console.error("Get assessments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);
    if (!assessment) return res.status(404).json({ message: "Not found" });

    // For students, do not send correct answers
    const plain = assessment.toObject();
    if (req.user.role === "student") {
      plain.questions = plain.questions.map((q) => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
    }

    res.json(plain);
  } catch (err) {
    console.error("Get assessment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
