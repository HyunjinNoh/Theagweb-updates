import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentList from "./CommentList";
import '../styles/PostDetail.css';

function PostDetail() {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const navigate = useNavigate(); // 페이지 리다이렉션

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/posts/${postId}`);
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
  }, [postId]);

  //게시글 삭제 버튼 작동 함수
  const handleDelete = async () => {
    const confirmDelete = window.confirm("기사를 정말 삭제하시겠습니까?");

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("삭제 권한이 없습니다. ");
          return;
        }
        const response = await fetch(`http://localhost:7000/api/posts/${postId}`, {
          method: 'DELETE',
          headers: {  
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          alert("기사가 삭제되었습니다.");
          navigate("/"); // 삭제 후 홈으로 리다이렉트
        } else {
          throw new Error("기사 삭제에 실패했습니다.");
        }
      } catch (err) {
        console.error("기사 삭제 오류:", err);
        alert("삭제 권한이 없습니다.");
      }
    }
  };

  if (error) {
    return <div>게시글 조회 오류: {error}</div>;
  }

  if (!post) {
    return <div className="postdetail-loading">Loading... </div>;
  }

  return (
    <div>
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <p> Publication Date: 20{post.publicationDate.toString()[0]}{post.publicationDate.toString()[1]}.&nbsp;
           {post.publicationDate.toString()[2]}{post.publicationDate.toString()[3]}.&nbsp;
           {post.publicationDate.toString()[4]}{post.publicationDate.toString()[5]}.&nbsp;
          | Posting Date: {new Date(post.createdAt).toLocaleDateString("ko-KR")} 
          <button className="post-delete-btn" onClick={handleDelete}>| Delete Post</button>
        </p>
      </div>
      <div className="comment-list">
        <CommentList postId={postId} />
      </div>
    </div>
  );
}

export default PostDetail;
