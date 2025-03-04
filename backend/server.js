import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { swaggerUi, specs } from './config/swagger.js'; 
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000; // 기본 포트 추가

// Swagger UI 연결
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

const allowedOrigins = [
  "http://theajouglobe.kr", // 새로 등록한 도메인
  "http://13.124.221.187", // 기존 IP 주소
];

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
);
/*
// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)
*/

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
app.use("/api/posts", commentRoutes); //여기 파라미터가 있으면 req.params가 인식 못 함

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running`);
});