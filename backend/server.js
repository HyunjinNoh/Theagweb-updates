import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000; // 기본 포트 추가

// CORS 설정
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(express.json()); // JSON 요청 파싱

// Connect to MongoDB
connectDB();

// Simple Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
