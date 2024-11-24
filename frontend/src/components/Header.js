import React from "react";
import "./../styles/Header.css";

function Header() {
  return (
    <header
      className="header"
      onClick={() => (window.location.href = "/")} // 루트로 이동
    >
      <h1>The Ajou Globe</h1>
    </header>
  );
}

export default Header;
