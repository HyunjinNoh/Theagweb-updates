import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import OnlyReporters from "./components/OnlyReporters";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";

import CategoryMenu from "./components/CategoryMenu";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import PostDetail from "./components/PostDetail";

import Footer from "./components/Footer";
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
  const [searchData, setSearchData] = useState(null); // 검색 조건
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const onLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // 로그인 상태 복원
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
        <Navbar/>
        <Header/>
        <Routes>
          <Route path="/"
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
          <Route path="/reporters" element={<OnlyReporters isLoggedIn={isLoggedIn} userRole={userRole} onLogout={onLogout} />}/>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<PostForm userRole={userRole} />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
