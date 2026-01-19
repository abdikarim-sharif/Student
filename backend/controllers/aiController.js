// backend/controllers/aiController.js
const axios = require("axios");

// Debug: confirm key is there
console.log("OpenRouter key present?", !!process.env.OPENROUTER_API_KEY);

// helper to call OpenRouter once
async function callOpenRouter(prompt) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Server missing OPENROUTER_API_KEY");
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: "You are a helpful AI tutor assistant." },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Smart Student Assessment",
      },
      timeout: 30000,
    }
  );

  return (
    response.data?.choices?.[0]?.message?.content ||
    "No content returned from AI."
  );
}

/**
 * POST /api/ai/summary
 * Body: { content }
 * -> AI sharaxaad/lesson/summary soo saaro
 */
exports.summary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const prompt = `
You are a helpful AI tutor assistant.

Generate a clear, detailed explanation in Markdown.
Make it easy for a student to understand.
If the user requests a specific language, follow it.

CONTENT:
${content}
`;

    const text = await callOpenRouter(prompt);
    return res.json({ summary: text });
  } catch (err) {
    console.error(
      "OpenRouter AI summary error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: "Failed to generate summary. Try again." });
  }
};

/**
 * POST /api/ai/notes
 * Body: { title, description, level, focus }
 * -> Soo saara notes + summary + practice questions
 */
exports.generateStudyNotes = async (req, res) => {
  try {
    const { title, description, level, focus } = req.body;

    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Please send at least a title or description." });
    }

    const prompt = `
You are a helpful AI tutor for the course "${title || "Untitled course"}".

Course description:
${description || "No extra description provided."}

Student level: ${level || "undergraduate"}
Focus: ${focus || "general understanding"}

Create structured study material in clear Markdown:

1. Short summary (3–5 sentences).
2. Key concepts – 5–8 bullet points.
3. One concrete example that explains an important concept.
4. 3 practice questions with short answers.

Use simple language and be very clear.
`;

    const text = await callOpenRouter(prompt);
    return res.json({ notes: text });
  } catch (err) {
    console.error(
      "OpenRouter AI notes error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: "Failed to generate study notes. Try again." });
  }
};

/**
 * POST /api/ai/assessment
 * Body: { title, description, level }
 * -> AI ku sameeyo quiz / assessment (su'aalo)
 */
exports.generateAssessment = async (req, res) => {
  try {
    const { title, description, level } = req.body;

    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Please send at least a title or description." });
    }

    const prompt = `
You are an exam generator for the course "${title || "Untitled course"}".

Course description:
${description || "No extra description provided."}

Student level: ${level || "undergraduate"}

Create a short assessment in clear Markdown:

- 5 multiple-choice questions.
- For each question, show:
  - The question text.
  - 4 options labelled A, B, C, D.
  - Indicate the correct answer as "Correct: X".

Keep it aligned with the course and use simple language.
`;

    const text = await callOpenRouter(prompt);
    return res.json({ assessment: text });
  } catch (err) {
    console.error(
      "OpenRouter AI assessment error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: "Failed to generate assessment. Try again." });
  }
};
