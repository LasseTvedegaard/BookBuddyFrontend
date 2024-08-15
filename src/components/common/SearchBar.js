import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchComponent({ placeholder, value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="p-2 w-full rounded-md dark:text-gray-400 bg-white dark:bg-ff_bg_sidebar_dark border border-gray-300 dark:border-gray-600"
      />
      <span className="absolute right-3 top-3 text-gray-400  ">
        <FaSearch />
      </span>
    </div>
  );
}

export default SearchComponent;
