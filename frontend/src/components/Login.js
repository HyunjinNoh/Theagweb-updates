import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Login.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        onLogin(data.role);  // 로그인 후 역할 전달
        alert("로그인 되었습니다.");
        navigate("../reporters");
      } else {
        alert(data.message || "로그인이 되지 않았습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>로그인 (기자만 가능합니다.)</h2>
      <input
        className="email"
        type="email"
        placeholder="아주메일 (예: theajouglobe@ajou.ac.kr)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit}>완료</button>
    </div>
  );
}

export default Login;
