import express from "express";
import { verifyReporter } from "../middleware/verifyReporter.js";
import postController from "../controllers/postController.js";

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
 * /{postId}/postImage:
 *   post:
 *     summary: Upload post image
 *     description: Allows the user to upload an image for a specific post.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to upload the image for.
 *         schema:
 *           type: string
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
 *         description: Image successfully uploaded
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Post not found
 */
router.post('/:postId/postImages', postController.uploadPostImage);

/**
 * @swagger
 * /{postId}/thumbnail:
 *   post:
 *     summary: Upload post thumbnail
 *     description: Allows the user to upload a thumbnail for a specific post.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to upload the thumbnail for.
 *         schema:
 *           type: string
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
 *         description: Thumbnail successfully uploaded
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Post not found
 */
router.post('/:postId/thumbnail', postController.uploadThumbnail);

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
