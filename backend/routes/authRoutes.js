import express from 'express';
import authController from "../controllers/authController.js";
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - 회원가입, 로그인
 *     summary: 회원가입
 *     description: 새 사용자를 등록합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 회원가입이 완료되었습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - 회원가입, 로그인
 *     summary: 로그인
 *     description: 사용자가 로그인합니다.
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/login', authController.login);

export default router;
