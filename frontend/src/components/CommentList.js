import React, { useEffect, useState } from "react";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "", authorName: "" });
  const [error, setError] = useState(null);

  // 댓글 조회 API 호출
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for postId:", postId); // 디버깅 로그 추가
        const response = await fetch(`/api/comments/${postId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched comments:", data); // 데이터 확인
        setComments(data); // 댓글 상태 업데이트
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.message);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.content || !newComment.authorName) {
      alert("Please fill in both your name and comment.");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newComment, postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([data.comment, ...comments]); // 새 댓글 추가
      setNewComment({ content: "", authorName: "" }); // 입력 필드 초기화
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err.message);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Your name"
          value={newComment.authorName}
          onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
        />
        <textarea
          placeholder="Write your comment..."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
      {error && <p className="error">{error}</p>}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <p><strong>{comment.authorName}:</strong> {comment.content}</p>
            <p className="comment-timestamp">
              {new Date(comment.createdAt).toLocaleString("ko-KR")}
            </p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}

export default CommentList;
