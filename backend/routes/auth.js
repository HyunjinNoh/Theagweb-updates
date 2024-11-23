import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 회원가입 라우트
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 필수 필드 검증
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 중복 이메일 검증
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Your Email already registered." });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 로그인 라우트
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // JWT 생성
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
