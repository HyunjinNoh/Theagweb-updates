import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./../styles/SearchBar.css";

Modal.setAppElement("#root");

function SearchBar({ onLogin, onLogout, isLoggedIn, userRole, onSearch }) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("title"); // 기본 필터: 제목

  const resetForm = () => setForm({ name: "", email: "", password: "" });

  const handleRegisterSubmit = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        setRegisterModalOpen(false);
        resetForm();
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.role);
        alert("Login successful!");
        setLoginModalOpen(false);
        resetForm();
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term.");
      return;
    }
  
    let apiPath = "";
    if (filterBy === "title") {
      apiPath = `/posts/search/title`;
    } else if (filterBy === "author") {
      apiPath = `/posts/search/author`;
    }
  
    const query = `?keyword=${encodeURIComponent(searchTerm)}`;
    navigate(`${apiPath}${query}`); // URL 업데이트
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <select
        className="filter-select"
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
      >
        <option value="title">Search by Title</option>
        <option value="author">Search by Author</option>
      </select>
      <input
        type="text"
        placeholder="Write the search term and press the 'Enter' key"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        className="search-input"
      />
      <button className="search-button" onClick={handleSearch}>
        🔍
      </button>
      <div className="auth-buttons">
        {!isLoggedIn ? (
          <>
            <button className="auth-button" onClick={() => setRegisterModalOpen(true)}>
              Register
            </button>
            <button className="auth-button" onClick={() => setLoginModalOpen(true)}>
              Login
            </button>
          </>
        ) : (
          <>
            <button className="auth-button" onClick={onLogout}>
              Logout
            </button>
            {userRole === "Reporter" && (
              <button
                className="auth-button posting-button"
                onClick={() => {
                  console.log("Navigating to /post");
                  navigate("/post");
                }}
              >
                Posting
              </button>
            )}
          </>
        )}
      </div>

      {/* 회원가입 모달 */}
      <Modal isOpen={isRegisterModalOpen} onRequestClose={() => setRegisterModalOpen(false)}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={handleRegisterSubmit}>Register</button>
      </Modal>

      {/* 로그인 모달 */}
      <Modal isOpen={isLoginModalOpen} onRequestClose={() => setLoginModalOpen(false)}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={handleLoginSubmit}>Login</button>
      </Modal>
    </div>
  );
}

export default SearchBar;
