import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useUser();
  const location = useLocation();

  const isAuthenticated = currentUser && currentUser.email;

  if (!isAuthenticated) {
    console.log("Ikke logget ind ➜ redirect til login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
