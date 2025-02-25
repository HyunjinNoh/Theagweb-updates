import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./services/postService.js";
import commentRoutes from "./services/commentService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000; // 기본 포트 추가

/*
const allowedOrigins = [
  "http://theajouglobe.kr", // 새로 등록한 도메인
  "http://13.124.221.187", // 기존 IP 주소
];
*/
/*
// CORS 설정
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // 허용
      } else {
        callback(new Error("Not allowed by CORS")); // 차단
      }
    },
    credentials: true,
  })
);*/
// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

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