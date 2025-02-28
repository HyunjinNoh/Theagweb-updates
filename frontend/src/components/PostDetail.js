import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentList from "./CommentList";

function PostDetail() {
  const { id } = useParams(); // URL에서 postId 가져오기
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [userRole, setUserRole] = useState(""); // 사용자 역할
  const [currentUserId, setCurrentUserId] = useState(""); // 현재 사용자 ID
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        setPost(data); // 게시글 데이터 상태 업데이트
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId"); // userId를 로컬 스토리지에서 가져옴

    if (token) {
      setUserRole(role || "");
      setCurrentUserId(userId || "");
    }
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:7000/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete the post");
        }
        alert("Post deleted successfully!");
        navigate("/"); // 삭제 후 홈 화면으로 이동
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Error deleting post. Please try again later.");
        setError(err.message);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Loading post...</div>;
  }

  const isAuthor = currentUserId === post.author?._id;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>
        <strong>Reporter:</strong> {post.author?.name || "Unknown"} <br />
        <strong>Posted on:</strong> {new Date(post.createdAt).toLocaleString("ko-KR")}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {isAuthor && (
        <div className="post-actions">
          <button onClick={() => navigate(`/post/edit/${id}`)}>Modify</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <CommentList postId={id} />
    </div>
  );
}

export default PostDetail;
