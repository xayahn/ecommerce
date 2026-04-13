/**
 * auth.js
 * JWT authentication middleware.
 */

import jwt    from "jsonwebtoken";
import config from "../settings/config.js";
import prisma from "../settings/db.js";
import { AppError } from "./errorHandler.js";

/**
 * Hard auth guard — rejects request if no valid token.
 */
export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Please log in.", 401);
    }
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where:  { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    if (!user) throw new AppError("User no longer exists.", 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")  return next(new AppError("Invalid token.", 401));
    if (err.name === "TokenExpiredError")  return next(new AppError("Token expired.", 401));
    next(err);
  }
};

/**
 * Soft auth — attaches user if token is present and valid.
 * Does NOT block the request if no token. req.user will be undefined.
 */
export const optionalProtect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where:  { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    if (user) req.user = user;
    next();
  } catch {
    // Invalid token — just skip attaching user, don't block
    next();
  }
};

/**
 * Restricts route to specific roles only.
 * Must be used AFTER protect middleware.
 */
export const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError("You do not have permission.", 403));
  }
  next();
};