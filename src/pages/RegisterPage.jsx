/**
 * RegisterPage.jsx
 * New user registration form.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../components/Spinner";
import SEO from "../components/SEO";

const RegisterPage = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
    confirm:   "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError,   setLocalError  ] = useState("");

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      const { firstName, lastName, email, password } = formData;
      await register({ firstName, lastName, email, password });
      navigate("/");
    } catch {
      // error handled in AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <SEO title="Create Account" url="/register" noIndex />
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-brand-600">
              ShopStore
            </h1>
          </Link>
          <p className="mt-2 text-neutral-500 text-sm">
            Create your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">

          {/* Error Banner */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                             placeholder:text-neutral-400 transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                             placeholder:text-neutral-400 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
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
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
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
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           placeholder:text-neutral-400 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Re-enter password"
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;