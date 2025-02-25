import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryMenu from "./components/CategoryMenu";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import PostDetail from "./components/PostDetail";
import "./App.css";

function App() {
  const categories = [
    "The Youth Globe",
    "Notice Board",
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
    setSelectedCategory(""); // 검색 조건이 설정되면 카테고리 초기화
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 설정
    setSearchData(null); // 카테고리 선택 시 검색 조건 초기화
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
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
                  onCategorySelect={handleCategorySelect}
                />
                <PostList
                  category={selectedCategory}
                  keyword={searchData?.keyword}
                  filterBy={searchData?.filterBy}
                />
              </>
            }
          />
          <Route
            path="/posts/search/title"
            element={
              <PostList
                keyword={searchData?.keyword}
                filterBy="title"
                category={selectedCategory}
              />
            }
          />
          <Route
            path="/posts/search/author"
            element={
              <PostList
                keyword={searchData?.keyword}
                filterBy="author"
                category={selectedCategory}
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
