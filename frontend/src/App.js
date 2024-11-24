import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryMenu from "./components/CategoryMenu";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import PostDetail from "./components/PostDetail";
import "./App.css";

function App() {
  const categories = [
    "Notice Board",
    "The Youth Globe",
    "On Campus",
    "Feature",
    "Issue",
    "Society",
    "Global",
    "Culture",
    "Entertainment",
    "Economics",
    "Business",
    "Technology",
  ];

  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
  const [userRole, setUserRole] = useState(""); // 사용자 역할 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [searchData, setSearchData] = useState(null); // 검색 조건

  // 로그인 상태 복원 로직
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleSearch = (searchData) => {
    setSearchData(searchData); // 검색 조건 저장
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <SearchBar
          onSearch={handleSearch}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLogin={(role) => {
            setUserRole(role);
            setIsLoggedIn(true);
            localStorage.setItem("role", role); // Role 저장
          }}
          onLogout={() => {
            setUserRole("");
            setIsLoggedIn(false);
            localStorage.removeItem("token"); // Token 제거
            localStorage.removeItem("role"); // Role 제거
          }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CategoryMenu
                  categories={categories}
                  onCategorySelect={(category) => {
                    setSearchData(null); // 검색 초기화
                    setSelectedCategory(category); // 카테고리 업데이트
                  }}
                />
                <PostList category={selectedCategory} />
              </>
            }
          />
          <Route
            path="/posts/search/title"
            element={
              <PostList
                searchParams={searchData?.filterBy === "title" ? searchData : null}
              />
            }
          />
          <Route
            path="/posts/search/author"
            element={
              <PostList
                searchParams={searchData?.filterBy === "author" ? searchData : null}
              />
            }
          />
          <Route path="/post" element={<PostForm userRole={userRole} />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/post/edit/:id" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
