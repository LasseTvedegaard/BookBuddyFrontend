import axios from "axios";

export default function HttpClient(baseURL) {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

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
