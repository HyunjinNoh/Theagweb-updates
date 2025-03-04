import express from "express";
import commentController from "../controllers/commentController.js";

const router = express.Router();

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     tags:
 *       - 댓글
 *     summary: 특정 게시글에 댓글 작성
 *     description: 특정 게시글에 댓글을 작성합니다.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: 댓글을 작성할 게시글의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               authorName:
 *                 type: string
 *     responses:
 *       201:
 *         description: 댓글이 작성되었습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.post("/:postId/comments", commentController.createComment);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     tags:
 *       - 댓글
 *     summary: 특정 게시글의 댓글 조회
 *     description: 특정 게시글에 대한 댓글들을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: 조회할 게시글의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록을 성공적으로 조회했습니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/:postId/comments", commentController.getComments);

//댓글 수정, 삭제 추가해야 함. 

export default router;
