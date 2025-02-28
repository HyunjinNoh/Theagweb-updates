import commentService from "../services/commentService.js";

// 댓글 작성
const createComment = async (req, res) => {
  const { content, authorName } = req.body;
  const { postId } = req.params;

  // 요청 데이터 검증
  if (!content || !authorName) {
    return res.status(400).json({ message: "닉네임과 내용 입력은 필수입니다." });
  }

  try {
    const result = await commentService.addComment(content, postId, authorName);
    if (result.success) {
      return res.status(201).json({ message: "댓글 작성을 완료하였습니다.", comment: result.comment });
    } else {
      return res.status(500).json({ message: "댓글 작성 오류" });
    }
  } catch (error) {
    console.error("댓글 작성 오류: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// 댓글 조회
const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await commentService.getCommentsByPostId(postId);
    if (result.success) {
      return res.status(200).json(result.comments);
    } else {
      return res.status(500).json({ message: "댓글 불러오기 오류" });
    }
  } catch (error) {
    console.error("댓글 불러오기 오류: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// 댓글 수정, 삭제 필요

const commentController = { createComment, getComments };
export default commentController;