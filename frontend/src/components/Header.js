import React from "react";
import "./../styles/Header.css";
import headerImage from "../assets/header-image.png";

function Header() {
  return (
    <header
      className="header"
      onClick={() => (window.location.href = "/")} // 루트로 이동
    >
      <img src={headerImage} className="header-image" />
    </header>
  );
}

export default Header;
