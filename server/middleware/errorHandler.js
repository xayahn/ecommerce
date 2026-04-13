/**
 * errorHandler.js
 * Global error handling middleware.
 * Must be the LAST middleware mounted in server.js.
 */

import config from "../settings/config.js";

/**
 * Custom AppError class — throw this anywhere in the app.
 * @example throw new AppError("Product not found", 404)
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handler middleware.
 * Catches all errors passed via next(err).
 */
export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isDev      = config.server.isDev;

  // Prisma known errors
  if (err.code === "P2002") {
    return res.status(409).json({
      status:  "error",
      message: "A record with this value already exists.",
      field:   err.meta?.target,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      status:  "error",
      message: "Record not found.",
    });
  }

  // Operational errors (thrown by AppError)
  if (err.isOperational) {
    return res.status(statusCode).json({
      status:  "error",
      message: err.message,
    });
  }

  // Unknown / programming errors — don't leak details in production
  console.error("💥 Unhandled error:", err);

  return res.status(500).json({
    status:  "error",
    message: isDev ? err.message : "Something went wrong. Please try again.",
    ...(isDev && { stack: err.stack }),
  });
};