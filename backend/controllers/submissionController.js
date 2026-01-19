const Assessment = require("../models/Assessment");
const Submission = require("../models/Submission");
const axios = require("axios");

// Simple scoring function
const calculateScore = (assessment, answers) => {
  let score = 0;
  let total = 0;

  const answerMap = {};
  answers.forEach((a) => {
    answerMap[a.questionId.toString()] = a.answer;
  });

  assessment.questions.forEach((q) => {
    total += q.marks || 1;
    const studentAnswer = answerMap[q._id.toString()];
    if (!studentAnswer) return;

    if (q.type === "mcq" || q.type === "true_false") {
      if (String(studentAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        score += q.marks || 1;
      }
    }
    // For short_answer you could implement fuzzy matching later
  });

  return { score, total };
};

// Call Gemini via Google Generative Language API (simplified example)
const generateFeedback = async (assessment, answers, score, total) => {
  try {
    if (!process.env.GEMINI_API_KEY) return null;

    const wrongQuestions = [];
    const answerMap = {};
    answers.forEach((a) => {
      answerMap[a.questionId.toString()] = a.answer;
    });

    assessment.questions.forEach((q) => {
      const studentAnswer = answerMap[q._id.toString()];
      if (!studentAnswer) return;

      const correct = String(studentAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      if (!correct) {
        wrongQuestions.push({
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
          studentAnswer,
        });
      }
    });

    const prompt = `
You are a helpful tutor. A student took an assessment called "${assessment.title}".
Their score is ${score} out of ${total}.

These are the questions they got wrong (if any):
${wrongQuestions
  .map(
    (w, i) =>
      `${i + 1}. Question: ${w.questionText}\n   Correct answer: ${w.correctAnswer}\n   Student answer: ${w.studentAnswer}\n`
  )
  .join("\n")}

Give short, encouraging feedback in 3–5 sentences. Focus on which topics they should review and how to improve.
`;

    // Simple HTTP call to Gemini 1.5 text API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Good effort! Review your weak areas and keep practicing.";

    return text;
  } catch (err) {
    console.error("Gemini feedback error:", err.response?.data || err.message);
    return null;
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const { id } = req.params; // assessment id
    const { answers } = req.body; // [{questionId, answer}]

    const assessment = await Assessment.findById(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    const { score, total } = calculateScore(assessment, answers);

    const feedback = await generateFeedback(assessment, answers, score, total);

    const submission = await Submission.create({
      assessment: id,
      student: req.user._id,
      answers,
      score,
      totalMarks: total,
      aiFeedback: feedback,
    });

    res.status(201).json(submission);
  } catch (err) {
    console.error("Submit assessment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionsForAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await Submission.find({ assessment: id })
      .populate("student", "name email")
      .sort("-createdAt");
    res.json(submissions);
  } catch (err) {
    console.error("Get submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id)
      .populate("student", "name email")
      .populate("assessment", "title");
    if (!submission) return res.status(404).json({ message: "Not found" });
    res.json(submission);
  } catch (err) {
    console.error("Get submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
