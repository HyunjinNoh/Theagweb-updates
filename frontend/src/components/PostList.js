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

        // 카테고리 필터만
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

        // 데이터를 정렬. 호수는 내림차순, 면은 오름차순순
        const sortedData = data.sort((a, b) => {
          // post.issue를 내림차순으로 정렬
          if (b.issue !== a.issue) {
            return b.issue - a.issue; // 내림차순
          }

          // issue가 같을 경우, post.page[0]을 기준으로 오름차순 정렬
          const pageA1 = parseInt(a.page.toString()[0], 10);
          const pageB1 = parseInt(b.page.toString()[0], 10);
          if (pageA1 !== pageB1) {
            return pageA1 - pageB1; // 오름차순
          }

          // post.page[1]을 기준으로 오름차순 정렬
          const pageA2 = parseInt(a.page.toString()[1], 10);
          const pageB2 = parseInt(b.page.toString()[1], 10);
          return pageA2 - pageB2; // 오름차순
        });

        setPosts(sortedData);
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
    return <div className="postlist-loading">Sorting...</div>;
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
          Category: "{category}"
        </h2>
      )}
      {posts.map((post) => (
        <div
          className="post-card"
          key={post._id}
          onClick={() => navigate(`/posts/${post._id}`)}
        >
          <img src={post.thumbnailImage} className="thumbnail-image" />
          <div className="post-content">
            <p className="postTitle"> {post.title} </p>
            <p className="postCategory">{post.category} | {post.issue}호 {post.page.toString()[0]}면 {post.page.toString()[1]} </p>
            <p className="postPreview"> {post.previewSentence} </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
