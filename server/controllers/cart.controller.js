/**
 * cart.controller.js
 * Handles all cart HTTP requests.
 */

import {
  findCartByToken,
  createCart,
  upsertCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../models/cart.model.js";
import { findProductById } from "../models/product.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { HTTP_STATUS, PROMO_CODES } from "../settings/constants.js";

/**
 * GET /api/v1/cart
 * Header: x-cart-token: <token>
 */
export const getCart = async (req, res, next) => {
  try {
    const token = req.headers["x-cart-token"];
    if (!token) throw new AppError("Cart token required.", 400);

    const cart = await findCartByToken(token);
    if (!cart) throw new AppError("Cart not found.", 404);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { cart } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/cart
 * Creates a new cart and returns its token.
 */
export const createNewCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const cart   = await createCart(userId);

    res.status(HTTP_STATUS.CREATED).json({ status: "success", data: { cart } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/cart/items
 * Body: { cartToken, productId, variantId, quantity }
 */
export const addItemToCart = async (req, res, next) => {
  try {
    const { cartToken, productId, variantId, quantity = 1 } = req.body;

    const cart = await findCartByToken(cartToken);
    if (!cart) throw new AppError("Cart not found.", 404);

    // Validate product exists
    const product = await findProductById(productId);
    if (!product) throw new AppError("Product not found.", 404);

    // Validate variant exists
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new AppError("Variant not found.", 404);

    // Check inventory
    if (variant.inventoryQuantity < quantity) {
      throw new AppError(`Only ${variant.inventoryQuantity} items left in stock.`, 400);
    }

    await upsertCartItem(cart.id, productId, variantId, quantity);
    const updatedCart = await findCartByToken(cartToken);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { cart: updatedCart } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/cart/items
 * Body: { cartToken, variantId, quantity }
 */
export const updateItem = async (req, res, next) => {
  try {
    const { cartToken, variantId, quantity } = req.body;

    const cart = await findCartByToken(cartToken);
    if (!cart) throw new AppError("Cart not found.", 404);

    await updateCartItemQuantity(cart.id, variantId, quantity);
    const updatedCart = await findCartByToken(cartToken);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { cart: updatedCart } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/cart/items/:variantId
 * Header: x-cart-token: <token>
 */
export const removeItem = async (req, res, next) => {
  try {
    const token     = req.headers["x-cart-token"];
    const variantId = req.params.variantId;

    const cart = await findCartByToken(token);
    if (!cart) throw new AppError("Cart not found.", 404);

    await removeCartItem(cart.id, variantId);
    const updatedCart = await findCartByToken(token);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { cart: updatedCart } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/cart/clear
 * Header: x-cart-token: <token>
 */
export const clearCartItems = async (req, res, next) => {
  try {
    const token = req.headers["x-cart-token"];
    const cart  = await findCartByToken(token);
    if (!cart) throw new AppError("Cart not found.", 404);

    await clearCart(cart.id);

    res.status(HTTP_STATUS.OK).json({ status: "success", message: "Cart cleared." });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/cart/promo
 * Body: { code }
 */
export const applyPromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const promo = PROMO_CODES[code?.toUpperCase()];

    if (!promo) throw new AppError("Invalid or expired promo code.", 400);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { promo } });
  } catch (err) {
    next(err);
  }
};