import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentList from "./CommentList";
import '../styles/PostDetail.css';

function PostDetail() {
  const { postId } = useParams(); // URL에서 postId 가져오기

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

  if (error) {
    return <div>게시글 조회 오류: {error}</div>;
  }

  if (!post) {
    return <div>로딩중입니다. </div>;
  }

  return (
    <div>
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <p> Posted on {new Date(post.createdAt).toLocaleDateString("ko-KR")} </p>
      </div>
      <div className="comment-list">
        <CommentList postId={postId} />
      </div>
    </div>
  );
}

export default PostDetail;
