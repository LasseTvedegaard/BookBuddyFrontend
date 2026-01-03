import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import {
  showLoadingToast,
  updateToast,
} from "../Toast";

console.log("API URL (REACT_APP_API_URL):", process.env.REACT_APP_API_URL);

const baseUrl = process.env.REACT_APP_API_URL;

export default function UserAuthForm() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

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

    const toastId = showLoadingToast("Logger ind...");

    try {
      const res = await fetch(`${baseUrl}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔑 KRITISK
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        updateToast(toastId, "Login gennemført", "success", "login-success");
        navigate(from, { replace: true });
      } else {
        updateToast(
          toastId,
          data.message || "Login mislykkedes",
          "error"
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      updateToast(toastId, "Fejl under login", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const toastId = showLoadingToast("Opretter bruger...");

    try {
      const res = await fetch(`${baseUrl}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔑 KRITISK
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        updateToast(
          toastId,
          "Bruger oprettet! Du kan nu logge ind.",
          "success"
        );
        setSuccess(true);
        setIsLogin(true);
        setLoginEmail(form.email);
        setForm({ email: "", firstName: "", lastName: "" });
      } else {
        updateToast(
          toastId,
          data.message || "Brugeroprettelse mislykkedes",
          "error"
        );
      }
    } catch (err) {
      console.error("Register error:", err);
      updateToast(toastId, "Fejl under oprettelse", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-md rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {isLogin ? "Log ind" : "Opret bruger"}
      </h2>

      <form
        onSubmit={isLogin ? handleLogin : handleRegister}
        className="space-y-4"
      >
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Fornavn"
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Efternavn"
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={isLogin ? loginEmail : form.email}
          onChange={(e) =>
            isLogin
              ? setLoginEmail(e.target.value)
              : setForm({ ...form, email: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-customYellow focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-customYellow hover:bg-customYellowDark text-black font-semibold py-2 rounded transition duration-200"
        >
          {isLogin ? "Log ind" : "Opret bruger"}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleForm}
        className="text-sm text-gray-800 hover:text-black mt-2 block mx-auto"
      >
        {isLogin
          ? "Har du ikke en bruger? Opret dig her"
          : "Allerede bruger? Log ind"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mt-4 text-center">
          Bruger oprettet! Du kan nu logge ind.
        </p>
      )}
    </div>
  );
}
