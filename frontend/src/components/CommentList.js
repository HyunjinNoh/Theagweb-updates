import React, { useEffect, useState } from "react";
import "./../styles/CommentList.css";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "", authorName: "" });
  const [error, setError] = useState(null);

  // 댓글 조회 API 호출
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for postId:", postId); // 디버깅 로그 추가
        const response = await fetch(`http://localhost:7000/api/posts/${postId}/comments`);
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
      alert("Please fill in both your nickname and comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newComment, postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment. Status: ${response.status}");
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
      <h3>Comments🕊️</h3>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Nickname"
          value={newComment.authorName}
          onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
        />
        <input 
          placeholder="Please add your comment."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
        />
      </div>
      <button className="comment-submit-btn" onClick={handleAddComment}>submit</button>
      {error && <p className="error">{error}</p>}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <p className="comment-content"><strong>{comment.authorName}:</strong> {comment.content}</p>
            <p className="comment-timestamp">
              {new Date(comment.createdAt).toLocaleString("ko-KR")}
            </p>
          </div>
        ))
      ) : (<p></p>)}
    </div>
  );
}

export default CommentList;
