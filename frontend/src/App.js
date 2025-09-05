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
import "./App.css";

function App() {
  const categories = [
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
    "Politics"
  ];

  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
  const [userRole, setUserRole] = useState(""); // 사용자 역할 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 설정
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Header />
        <div className="contents-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <CategoryMenu
                    categories={categories}
                    onCategorySelect={handleCategorySelect}
                  />
                  <PostList category={selectedCategory} />
                </>
              }
            />
            <Route
              path="/auth"
              element={<OnlyReporters isLoggedIn={isLoggedIn} userRole={userRole} onLogout={onLogout} />}
            />
            <Route path="/auth/login" element={<Login onLogin={onLogin} />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/posts" element={<PostForm/>} />
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </div>
        <footer className="footer">
          <img src={require("./assets/footer-image.png")} className="footer-image" />
        </footer>
      </div>
    </Router>
  );
}

export default App;
