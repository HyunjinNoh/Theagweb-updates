import React from "react";
import "./../styles/Header.css";

function Header() {
  return (
    <header
      className="header"
      onClick={() => (window.location.href = "/")} // 루트로 이동
    >
      <h1>Articles Page</h1>
      <h1>This is the test page, more articles will be uploaded soon.</h1>
    </header>
  );
}

export default Header;
