/**
 * auth.controller.js
 * Handles user registration, login, and profile.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../settings/db.js";
import config from "../settings/config.js";
import { AppError } from "../middleware/errorHandler.js";
import { HTTP_STATUS } from "../settings/constants.js";

/** Signs a JWT token for a given user id */
const signToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

/**
 * POST /api/v1/auth/register
 * Body: { email, password, firstName, lastName }
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already in use.", 409);

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const token = signToken(user.id);

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      data:   { user, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password.", 401);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new AppError("Invalid email or password.", 401);

    const token = signToken(user.id);

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: {
        user: {
          id:        user.id,
          email:     user.email,
          firstName: user.firstName,
          lastName:  user.lastName,
          role:      user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Requires: protect middleware
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data:   { user: req.user },
    });
  } catch (err) {
    next(err);
  }
};