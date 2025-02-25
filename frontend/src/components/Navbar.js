import React from "react";
//import faviconImage from '../assets/favicon-image.png'
import "./../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
        <ul className="navbar-links">
            <li><a href="https://theajouglobe.ajou.ac.kr/home">Home</a></li>
            <li><a href="http://theajouglobe.kr/" className="articles-link">Articles</a></li>
            <li><a href="https://ajouglobe1989.wixsite.com/press/blog">Previous Articles (~No.166)</a></li>
            <li><a href="https://www.instagram.com/theajouglobe">Instagram</a></li>
        </ul>
    </nav>
  );
}

export default Navbar;