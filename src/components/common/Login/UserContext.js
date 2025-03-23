import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("bookbuddy_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("bookbuddy_token");
  });

  const login = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem("bookbuddy_user", JSON.stringify(user));
    localStorage.setItem("bookbuddy_token", token);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("bookbuddy_user");
    localStorage.removeItem("bookbuddy_token");
  };

  return (
    <UserContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
