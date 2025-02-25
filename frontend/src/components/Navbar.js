import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
        <ul className="navbar-links">
            <li><a href="https://theajouglobe.ajou.ac.kr/home">Home</a></li>
            <li><a href="http://theajouglobe.kr/" className="articles-link">Articles</a></li>
            <li><a href="https://ajouglobe1989.wixsite.com/press/blog">Previous Articles (~No.166)</a></li>
            <li><a href="https://www.instagram.com/theajouglobe">Instagram</a></li>
        </ul>
        <button className="reporters-btn" onClick={() => navigate("/reporters")}>Only Reporters</button>
    </nav>
  );
}

export default Navbar;