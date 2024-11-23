import express from "express";
import Comment from "../models/Comment.js";
import { verifyReporter } from "../middleware/verifyReporter.js";

const router = express.Router();

// 댓글 작성 라우트
router.post("/", async (req, res) => {
  const { content, postId, authorName } = req.body;

  // 요청 데이터 검증
  if (!content || !postId || !authorName) {
    return res.status(400).json({ message: "Content, postId, and authorName are required." });
  }

  try {
    // 새로운 댓글 생성
    const comment = new Comment({
      content,
      post: postId,
      authorName, // 사용자가 입력한 이름 저장
    });

    // 데이터베이스에 저장
    await comment.save();
    res.status(201).json({ message: "Comment added successfully!", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment." });
  }
});

// 특정 게시글의 댓글 조회 라우트
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }); // 최신순 정렬
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments." });
  }
});

// 게시글 삭제 라우트
router.delete("/:id", verifyReporter, async (req, res) => {
    const { id } = req.params;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      // 작성자인지 확인
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to delete this post." });
      }
  
      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Error deleting post." });
    }
  });
export default router;
