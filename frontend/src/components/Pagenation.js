import React from "react";
import "./../styles/Pagination.css";

function Pagination({ totalPosts, postsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
