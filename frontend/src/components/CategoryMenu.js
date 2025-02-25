import React from "react";
import "./../styles/CategoryMenu.css";

function CategoryMenu({ categories, onCategorySelect }) {
  return (
    <div className="category-menu">
      {categories.map((category) => (
        <button
          key={category}
          className="category-button"
          onClick={() => onCategorySelect(category)}
        >
          {category}
          <div className="dot"></div>
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
