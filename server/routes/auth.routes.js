/**
 * auth.routes.js
 */
import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

// Basic rate limiter for auth endpoints to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many attempts, please try again later." },
});

router.post("/register", authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],
  validateRequest,
  register
);
router.post("/login", authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);
router.get("/me", protect, getMe);

export default router;