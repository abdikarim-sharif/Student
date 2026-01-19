// backend/server.js

// 1) Load env variables FIRST
const dotenv = require("dotenv");
dotenv.config(); // jUST come before using process.env in other files

// 2) Then require other modules
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*", // in production, restrict to your frontend URL
  })
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Student Assessment API running" });
});

// Main routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/assessments", require("./routes/assessmentRoutes"));
app.use("/api/ai", aiRoutes); // 👈 AI routes

// Error handler fallback
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
