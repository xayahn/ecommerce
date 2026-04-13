/**
 * axiosInstance.js
 * Global Axios instance with interceptors.
 * Import this in services — never in components directly.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach JWT token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach cart token if available
    const cartToken = localStorage.getItem("cart_token");
    if (cartToken) {
      config.headers["x-cart-token"] = cartToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // Auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("cart_token");
      window.location.href = "/login";
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default axiosInstance;