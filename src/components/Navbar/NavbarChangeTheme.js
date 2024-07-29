import React, { useContext } from 'react';
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from '../Theme/ThemeContext';

  export default function NavBarThemeButton() {
    const { theme, setTheme } = useContext(ThemeContext);
  
    return (
      <button
        className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-200 hover:dark:text-black" 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Toggle Theme
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>
    );
  }

