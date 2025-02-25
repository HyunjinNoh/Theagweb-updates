import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        navigate("../login");
      } else {
        alert(data.message || "회원가입이 완료되지 않았습니다.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>회원가입 (기자만 가능합니다.)</h2>
      <input 
        className="name"
        type="text"
        placeholder="기자명 (예: Hong Gil-Dong)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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

export default Register;
