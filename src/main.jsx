/**
 * main.jsx
 * React entry point — final production version.
 * ErrorBoundary → BrowserRouter → AuthProvider → CartProvider → WishlistProvider → App
 */

import React          from "react";
import ReactDOM       from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster }    from "react-hot-toast";

import ErrorBoundary    from "./components/ErrorBoundary";
import { AuthProvider }     from "./context/AuthContext";
import { CartProvider }     from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    fontSize:     "14px",
                    borderRadius: "10px",
                    fontFamily:   "Inter, sans-serif",
                  },
                  success: {
                    iconTheme: { primary: "#a521ce", secondary: "#fff" },
                  },
                  error: {
                    iconTheme: { primary: "#ef4444", secondary: "#fff" },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);