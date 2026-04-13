/**
 * AuthContext.jsx
 * Global authentication state using Context + useReducer.
 * Wrap your entire app with <AuthProvider> in main.jsx.
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  user:          null,
  token:         localStorage.getItem("auth_token") || null,
  isAuthenticated: false,
  isLoading:     true,  // true on mount while we verify token
  error:         null,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING:   "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT:        "LOGOUT",
  SET_ERROR:     "SET_ERROR",
  CLEAR_ERROR:   "CLEAR_ERROR",
  SET_USER:      "SET_USER",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: true,
        isLoading:       false,
        error:           null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user:            action.payload,
        isAuthenticated: true,
        isLoading:       false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        token:     null,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * On mount: if a token exists in localStorage,
   * verify it by calling GET /auth/me.
   */
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }
      try {
        const user = await authService.getMe();
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      } catch {
        // Token invalid or expired — clean up
        localStorage.removeItem("auth_token");
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    verifyToken();
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    try {
      const data = await authService.login(email, password);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data });
      toast.success(`Welcome back, ${data.user.firstName}! 👋`);
      return data;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      toast.error(err.message || "Login failed");
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    try {
      const data = await authService.register(formData);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data });
      toast.success(`Welcome to ShopStore, ${data.user.firstName}! 🎉`);
      return data;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: err.message });
      toast.error(err.message || "Registration failed");
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success("Logged out successfully");
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};