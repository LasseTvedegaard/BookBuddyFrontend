import axios from "axios";

export default function HttpClient(baseURL) {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // -----------------------------
  // REQUEST INTERCEPTOR
  // Tilføj Authorization-header med JWT
  // -----------------------------
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("bookbuddy_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // -----------------------------
  // RESPONSE INTERCEPTOR
  // Central 401-håndtering
  // -----------------------------
  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        const status = error.response.status;

        // 🔒 Automatisk logout ved 401
        if (status === 401) {
          console.warn("Unauthorized – token expired or invalid. Logging out.");

          // Ryd auth-state
          localStorage.removeItem("bookbuddy_token");
          localStorage.removeItem("bookbuddy_user");

          // Redirect til login
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  return {
    get(endpoint, params = {}) {
      return apiClient.get(endpoint, { params });
    },

    post(endpoint, data) {
      const config = {};

      // Håndtér FormData korrekt (uden at ændre global header)
      if (data instanceof FormData) {
        config.headers = {
          "Content-Type": undefined, // Lad browseren selv sætte boundary
        };
      }

      return apiClient.post(endpoint, data, config);
    },

    put(endpoint, data) {
      const config = {};

      if (data instanceof FormData) {
        config.headers = {
          "Content-Type": undefined,
        };
      }

      return apiClient.put(endpoint, data, config);
    },

    delete(endpoint) {
      return apiClient.delete(endpoint);
    },
  };
}
