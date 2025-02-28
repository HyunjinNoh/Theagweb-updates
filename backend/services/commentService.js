import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// 댓글 작성
const addComment = async (content, postId, authorName) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("해당 게시글을 찾을 수 없습니다.");
    }
    const comment = new Comment({
      content,
      post: postId,
      authorName, 
    });

    // 데이터베이스에 저장
    await comment.save();
    return { success: true, comment };
  } catch (error) {
    throw new Error("댓글 작성 오류: " + error.message);
  }
};

// 특정 게시글의 댓글 조회
const getCommentsByPostId = async (postId) => {
  try {
    const comments = await Comment.find(
      { post: postId })
      .sort({ createdAt: -1 });
    return { success: true, comments };
  } catch (error) {
    throw new Error("댓글 불러오기 오류: " + error.message);
  }
};

const commentService = { addComment, getCommentsByPostId };
export default commentService;