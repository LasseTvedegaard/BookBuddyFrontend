import React, { useContext } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { ThemeContext } from '../Theme/ThemeContext';

const CollapseButton = ({ open, setOpen, className }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <IoIosArrowRoundBack
      className={`${className} ${
        theme === 'dark' ? 'text-white' : 'text-black'
      } text-3xl cursor-pointer transform ${
        open ? 'rotate-180' : 'rotate-0'
      } transition-transform duration-300`}
      onClick={() => setOpen(!open)}
    />
  );
};

export default CollapseButton;
