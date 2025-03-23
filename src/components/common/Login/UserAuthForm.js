import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";

const baseUrl = process.env.REACT_APP_API_URL;

export default function UserAuthForm() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/books";

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-md rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">Log ind</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Log ind
        </button>
      </form>
  
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
      )}
    </div>
  );
  
}
