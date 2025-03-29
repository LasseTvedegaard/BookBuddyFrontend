import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ korrekt import
import { toast } from "react-toastify"; // ✅ toast import

const UserContext = createContext(undefined);

let logoutTimer;

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("bookbuddy_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("bookbuddy_token"));

  // 🧠 Beregn logout-tidspunkt fra token
  const scheduleAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token); // ✅ brug jwtDecode
      if (decoded.exp) {
        const expiryInMs = decoded.exp * 1000 - Date.now();
        console.log("Token udløber om (ms):", expiryInMs);
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
          logout();
          toast.warning("Din session er udløbet. Log ind igen.");
        }, expiryInMs);
      }
    } catch (err) {
      console.error("Kunne ikke dekode token:", err);
    }
  };

  const login = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem("bookbuddy_user", JSON.stringify(user));
    localStorage.setItem("bookbuddy_token", token);
    scheduleAutoLogout(token);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("bookbuddy_user");
    localStorage.removeItem("bookbuddy_token");
    clearTimeout(logoutTimer);
  };

  // ⏱ Automatisk logout ved refresh, hvis token stadig gælder
  useEffect(() => {
    if (token) {
      scheduleAutoLogout(token);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
