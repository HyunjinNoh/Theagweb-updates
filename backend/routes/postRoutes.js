import express from "express";
import { verifyReporter } from "../middleware/verifyReporter.js";
import postController from "../controllers/postController.js";

const router = express.Router();

//게시글 목록 조회
router.get("/", postController.getPosts);

//게시글 작성
router.post("/", verifyReporter, postController.createPost);

//특정 게시글 조회
router.get("/:id", postController.getPostById);

//특정 게시글 수정
//특정 게시글 삭제

export default router;
