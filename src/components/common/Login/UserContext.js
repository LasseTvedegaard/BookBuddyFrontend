import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const UserContext = createContext(undefined);

let logoutTimer;

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("bookbuddy_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("bookbuddy_token")
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("bookbuddy_user");
    localStorage.removeItem("bookbuddy_token");
    clearTimeout(logoutTimer);
  }, []);

  // 🧠 Beregn logout-tidspunkt fra token
  const scheduleAutoLogout = useCallback(
    (token) => {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp) {
          const expiryInMs = decoded.exp * 1000 - Date.now();

          clearTimeout(logoutTimer);
          logoutTimer = setTimeout(() => {
            logout();
            toast.warning("Din session er udløbet. Log ind igen.");
          }, expiryInMs);
        }
      } catch (err) {
        console.error("Kunne ikke dekode token:", err);
      }
    },
    [logout]
  );

  const login = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem("bookbuddy_user", JSON.stringify(user));
    localStorage.setItem("bookbuddy_token", token);
    scheduleAutoLogout(token);
  };

  // ⏱ Automatisk logout ved refresh
  useEffect(() => {
    if (token) {
      scheduleAutoLogout(token);
    }
  }, [token, scheduleAutoLogout]);

  return (
    <UserContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
