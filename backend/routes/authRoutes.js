import express from 'express';
import authController from "../controllers/authController.js";
const router = express.Router();

//회원가입
router.post('/register', authController.register);

//로그인
router.post('/login', authController.login);

export default router;