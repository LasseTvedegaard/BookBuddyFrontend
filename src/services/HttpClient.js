import axios from "axios";

export default function HttpClient(baseURL) {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Tilføj Authorization-header med token fra localStorage
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("bookbuddy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Håndter API-respons og fejl
  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API fejl:", error);
      return Promise.reject(error);
    }
  );

  return {
    get(endpoint, params = {}) {
      return apiClient.get(endpoint, { params });
    },
    post(endpoint, data) {
      if (data instanceof FormData) {
        delete apiClient.defaults.headers["Content-Type"];
      }
      return apiClient.post(endpoint, data);
    },
    put(endpoint, data) {
      if (data instanceof FormData) {
        delete apiClient.defaults.headers["Content-Type"];
      }
      return apiClient.put(endpoint, data);
    },
    delete(endpoint) {
      return apiClient.delete(endpoint);
    },
  };
}
