import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { BsFillFilePersonFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import NavBarThemeButton from "./NavbarChangeTheme";
import LogOutButton from "../Credentials/LogOutButton";

const ProfileDropdown = forwardRef((props, ref) => (
  <div
    ref={ref}
    className="fixed top-16 right-0 mt-1 w-64 rounded-lg bg-white dark:bg-ff_bg_sidebar_dark shadow-md z-50 mr-2"
    onClick={props.onClick}
  >
    <Link
      to="/profilesettings"
      className="flex justify-between items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      Profile
      <BsFillFilePersonFill />
    </Link>
    <Link
      to="/settings"
      className="flex justify-between items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      Settings
      <FaCog />
    </Link>
    <NavBarThemeButton className="w-full" />
    <LogOutButton className="w-full" />
  </div>
));

export default ProfileDropdown;
