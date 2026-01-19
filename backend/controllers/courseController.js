const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = await Course.create({
      name,
      code,
      lecturer: req.user._id,
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "lecturer") {
      query.lecturer = req.user._id;
    } else if (req.user.role === "student") {
      query.students = req.user._id;
    }

    const courses = await Course.find(query)
      .populate("lecturer", "name email")
      .populate("students", "name email");

    res.json(courses);
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.students.includes(req.user._id)) {
      course.students.push(req.user._id);
      await course.save();
    }

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
