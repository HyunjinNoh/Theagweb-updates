import Comment from "../models/Comment.js";

// 댓글 작성
const addComment = async (content, postId, authorName) => {
  try {
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