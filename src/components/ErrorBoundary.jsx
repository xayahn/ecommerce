/**
 * ErrorBoundary.jsx
 * Catches unexpected runtime errors in the React tree.
 * Wraps the entire app in main.jsx — prevents full white screen crashes.
 */

import { Component } from "react";
import { Link }      from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production swap this for a real error tracker (Sentry, LogRocket, etc.)
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center
                        justify-center text-center px-4 py-16">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center
                          justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
            Something Went Wrong
          </h1>
          <p className="text-neutral-500 max-w-md mb-8">
            An unexpected error occurred. Our team has been notified.
            You can try refreshing the page or go back home.
          </p>

          {/* Dev-only error details */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-6 max-w-xl w-full text-left">
              <summary className="cursor-pointer text-sm text-neutral-400
                                  hover:text-neutral-700 font-medium mb-2">
                Error details (dev only)
              </summary>
              <pre className="bg-neutral-900 text-red-400 text-xs p-4 rounded-xl
                              overflow-auto max-h-48 whitespace-pre-wrap">
                {this.state.error.toString()}
                {"\n"}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                this.handleReset();
                window.location.reload();
              }}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white
                         font-semibold rounded-xl transition"
            >
              Refresh Page
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="px-6 py-3 border-2 border-brand-600 text-brand-600
                         font-semibold rounded-xl hover:bg-brand-50 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;