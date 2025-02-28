import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/PostList.css";

function PostList({ category }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        let endpoint = "http://localhost:7000/api/posts"; 

        // 카테고리 필터만만
        if (category) {
          endpoint += `?category=${encodeURIComponent(category)}`;
        }

        // 서버에서 API를 호출하여 데이터를 가져옵니다.
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorText = await response.text(); // HTML 응답을 텍스트로 받기
          throw new Error(`Error: ${response.status} - ${errorText}`); // 오류 메시지와 함께 응답 내용 출력
        }

        const data = await response.json();
        setPosts(data);
        setError(null); 
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]); 
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]); // 카테고리 변경 시마다 데이터를 새로 불러옵니다.

  if (loading) {
    return <div className="post-list">로딩중입니다.</div>;
  }

  if (error) {
    return (
      <div className="post-list">
        <h2 style={{ fontWeight: "bold", margin: "20px 0" }}>{error}</h2>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="post-list">
        <h2 style={{ fontWeight: "bold", margin: "20px 0" }}>
          해당 카테고리의 게시글이 없습니다.
        </h2>
      </div>
    );
  }

  return (
    <div className="post-list">
      {category && (
        <h2 style={{ fontWeight: "bold", margin: "20px 0" }}>
          카테고리: "{category}"
        </h2>
      )}
      {posts.map((post) => (
        <div
          className="post-card"
          key={post._id}
          onClick={() => navigate(`/posts/${post._id}`)}
        >
          <h2>{post.title}</h2>
          <p>Category: {post.category}</p>
          <p>Reporter: {post.author?.name || "Unknown"}</p>
          <p>Views: {post.views}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
