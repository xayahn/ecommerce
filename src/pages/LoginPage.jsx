/**
 * LoginPage.jsx
 * User login with email + password.
 * Redirects to the page they came from after login.
 */

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    clearError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch {
      // error is handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <SEO title="Sign In" url="/login" noIndex />
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-brand-600">
              ShopStore
            </h1>
          </Link>
          <p className="mt-2 text-neutral-500 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           placeholder:text-neutral-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-brand-600 hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           placeholder:text-neutral-400 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700
                         text-white font-semibold py-2.5 rounded-lg transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" color="white" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 mb-1">
              Demo credentials:
            </p>
            <p className="text-xs text-neutral-600">
              📧 customer@shopstore.com
            </p>
            <p className="text-xs text-neutral-600">
              🔑 Customer@123
            </p>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-brand-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;