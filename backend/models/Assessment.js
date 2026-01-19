const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    type: { type: String, enum: ["mcq", "true_false", "short_answer"], required: true },
    options: [{ type: String }], // For MCQ
    correctAnswer: { type: String }, // or "true"/"false" or text
    marks: { type: Number, default: 1 },
  },
  { _id: true }
);

const assessmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["quiz", "exam", "assignment"], default: "quiz" },
    startTime: Date,
    endTime: Date,
    durationMinutes: Number,
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
