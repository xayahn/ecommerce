/**
 * orders.routes.js
 */

import { Router } from "express";
import { body }   from "express-validator";
import { placeOrder, getOrder, getMyOrders } from "../controllers/orders.controller.js";
import { protect, optionalProtect } from "../middleware/auth.js";
import { validateRequest }          from "../middleware/validateRequest.js";

const router = Router();

// Place order — optionalProtect so userId is captured when logged in
router.post(
  "/",
  optionalProtect,
  [
    body("cartToken").notEmpty().withMessage("Cart token is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
  ],
  validateRequest,
  placeOrder
);

// My orders — must be logged in
router.get("/my-orders", protect, getMyOrders);

// Single order by ID — must come AFTER /my-orders to avoid route conflict
router.get("/:id", getOrder);

export default router;