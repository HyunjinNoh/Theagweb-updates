import express from "express";
import { verifyReporter } from "../middleware/verifyReporter.js";
import postController from "../controllers/postController.js";
import fileUploadService from '../services/fileUploadService.js';

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - 게시글
 *     summary: 게시글 목록 조회
 *     description: 게시글 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 게시글 목록을 성공적으로 조회했습니다.
 *       404:
 *         description: 게시글이 없습니다.
 */
router.get("/", postController.getPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - 게시글
 *     summary: 게시글 작성
 *     description: 새 게시글을 작성합니다. (작성자는 기자만 가능)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 작성되었습니다.
 *       403:
 *         description: 권한이 없습니다.
 */
router.post("/", verifyReporter, postController.createPost);

/**
 * @swagger
 * /posts/{postId}/files:
 *   post:
 *     tags:
 *       - 파일 업로드
 *     summary: 파일 업로드
 *     description: 이미지를 업로드합니다. (현재는 이미지 파일만)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 파일이 성공적으로 업로드되었습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.post('/:postId/files', fileUploadService.upload.single('file'), postController.uploadFileToPost);

//파일 삭제 추가해야 함. 

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     tags:
 *       - 게시글
 *     summary: 특정 게시글 조회
 *     description: 특정 게시글의 세부 내용을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글을 성공적으로 조회했습니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/:postId", postController.getPostById);

// 특정 게시글 수정, 삭제 추가해야 함. 

export default router;
