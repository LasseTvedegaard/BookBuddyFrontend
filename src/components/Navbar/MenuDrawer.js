import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Theme/ThemeContext';
import MenuItems from '../Menu/MenuItems';

const MenuDrawer = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 w-64 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      } transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-30 overflow-y-auto`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-black dark:text-white focus:outline-none"
        >
          X
        </button>
      </div>
      <nav className="mt-10">
        {MenuItems.map((menu, index) => (
          <Link
            key={index}
            to={menu.path}
            className="flex items-center justify-start px-6 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <span className="text-2xl mr-4">{menu.icon}</span>
            <span className="text-lg">{menu.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MenuDrawer;
