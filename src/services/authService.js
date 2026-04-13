/**
 * authService.js
 * All auth-related API calls.
 */

import api from "../api/axiosInstance.js";

export const authService = {
  register: (data) =>
    api.post("/auth/register", data).then((r) => {
      localStorage.setItem("auth_token", r.data.data.token);
      return r.data.data;
    }),

  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => {
      localStorage.setItem("auth_token", r.data.data.token);
      return r.data.data;
    }),

  getMe: () =>
    api.get("/auth/me").then((r) => r.data.data.user),

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("cart_token");
  },
};