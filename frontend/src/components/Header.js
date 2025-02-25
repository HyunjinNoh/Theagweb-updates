import React from "react";
import headerImage from '../assets/header-image.png'
import "./../styles/Header.css";

function Header() {
  return (
    <header
      className="header"
      onClick={() => (window.location.href = "/")} // 루트로 이동
    >
      <img src={headerImage} className="header-img" />
    </header>
  );
}

export default Header;
