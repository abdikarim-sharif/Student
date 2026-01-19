const express = require("express");
const router = express.Router();

const multer = require("multer");

// ✅ SAFE pdf-parse loader (fix for "pdfParse is not a function")
const pdfParsePkg = require("pdf-parse");
const pdfParse =
  (typeof pdfParsePkg === "function" ? pdfParsePkg : null) ||
  (typeof pdfParsePkg?.default === "function" ? pdfParsePkg.default : null) ||
  (typeof pdfParsePkg?.pdfParse === "function" ? pdfParsePkg.pdfParse : null) ||
  (typeof pdfParsePkg?.PDFParse === "function" ? pdfParsePkg.PDFParse : null);

if (!pdfParse) {
  console.log("❌ pdf-parse export is not a function:", pdfParsePkg);
}

// ✅ upload (multer)
const upload = multer({ storage: multer.memoryStorage() });

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

// ✅ PDF notes
router.post("/notes/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file missing" });
    }

    if (!pdfParse) {
      return res.status(500).json({
        message: "pdf-parse package ma shaqeynayo. Fadlan beddel version-ka pdf-parse.",
      });
    }

    const data = await pdfParse(req.file.buffer);
    const extractedText = (data.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({
        message:
          "PDF text lama helin. Haddii PDF-ga scanned yahay (image), text lama soo saari karo.",
      });
    }

    req.body = {
      title: req.body.title || "PDF Notes",
      description: extractedText,
      level: req.body.level || "undergraduate",
      focus: req.body.focus || "lecture notes and summary",
    };

    return generateStudyNotes(req, res);
  } catch (err) {
    console.error("PDF NOTES ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate summary. Try again." });
  }
});

module.exports = router;
