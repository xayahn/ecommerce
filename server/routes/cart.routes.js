/**
 * cart.routes.js
 */
import { Router } from "express";
import { body } from "express-validator";
import {
  getCart, createNewCart, addItemToCart,
  updateItem, removeItem, clearCartItems, applyPromoCode,
} from "../controllers/cart.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.get(    "/",              getCart);
router.post(   "/",              createNewCart);
router.post(   "/items",
  [
    body("cartToken").notEmpty().withMessage("Cart token is required"),
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("variantId").notEmpty().withMessage("Variant ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  validateRequest,
  addItemToCart
);
router.patch(  "/items",         updateItem);
router.delete( "/items/:variantId", removeItem);
router.delete( "/clear",         clearCartItems);
router.post(   "/promo",
  [body("code").notEmpty().withMessage("Promo code is required")],
  validateRequest,
  applyPromoCode
);

export default router;