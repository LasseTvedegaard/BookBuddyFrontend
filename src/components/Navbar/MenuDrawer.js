import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../Theme/ThemeContext';
import { useUser } from '../common/Login/UserContext'; // <-- bruger info
import MenuItems from '../Menu/MenuItems';

const MenuDrawer = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

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

      {currentUser && (
  <>
    <hr className="border-gray-300 dark:border-gray-700 mt-6 mb-4 mx-6" />
    <div className="px-6 pb-6">
<button
  onClick={handleLogout}
  className="w-full text-center bg-customYellow hover:bg-customYellowDark text-black font-medium py-2 rounded transition duration-200"
>
  Log ud
</button>

    </div>
  </>
)}

    </div>
  );
};

export default MenuDrawer;
