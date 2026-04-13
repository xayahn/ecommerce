/**
 * orders.controller.js
 * Handles order creation and retrieval.
 */

import {
  createOrder,
  findOrderById,
  findOrdersByUserId,
} from "../models/order.model.js";
import { findCartByToken, clearCart } from "../models/cart.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { HTTP_STATUS, PROMO_CODES } from "../settings/constants.js";

/**
 * POST /api/v1/orders
 * Body: { cartToken, email, shippingAddress, paymentMethod, discountCode }
 */
export const placeOrder = async (req, res, next) => {
  try {
    const { cartToken, email, shippingAddress, paymentMethod, discountCode } = req.body;

    // 1. Get cart
    const cart = await findCartByToken(cartToken);
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty or not found.", 400);
    }

    // 2. Build line items from cart
    const lineItems = cart.items.map((item) => {
      const variant = item.product.variants.find((v) => v.id === item.variantId);
      return {
        productId:    item.productId,
        variantId:    item.variantId,
        title:        item.product.title,
        variantTitle: variant?.title || "Default",
        quantity:     item.quantity,
        price:        variant?.price || 0,
        imageSrc:     item.product.images?.[0]?.src || null,
      };
    });

    // 3. Calculate totals
    const subtotal = lineItems.reduce(
      (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
    );

    let discountAmount = 0;
    if (discountCode) {
      const promo = PROMO_CODES[discountCode.toUpperCase()];
      if (promo) {
        discountAmount = promo.type === "percentage"
          ? subtotal * promo.discount
          : promo.discount;
      }
    }

    const afterDiscount = subtotal - discountAmount;
    const tax           = parseFloat((afterDiscount * 0.09).toFixed(2));
    const total         = parseFloat((afterDiscount + tax).toFixed(2));

    // 4. Create order
    const order = await createOrder({
      userId:          req.user?.id || null,
      email,
      lineItems,
      subtotalPrice:   subtotal.toFixed(2),
      totalTax:        tax,
      totalPrice:      total,
      shippingAddress,
      paymentMethod:   paymentMethod || "mock",
      discountCode:    discountCode  || null,
      discountAmount:  discountAmount > 0 ? discountAmount.toFixed(2) : null,
      financialStatus: "PAID",
    });

    // 5. Clear cart after successful order
    await clearCart(cart.id);

    res.status(HTTP_STATUS.CREATED).json({ status: "success", data: { order } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/orders/:id
 */
export const getOrder = async (req, res, next) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) throw new AppError("Order not found.", 404);

    res.status(HTTP_STATUS.OK).json({ status: "success", data: { order } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/orders/my-orders
 * Requires: protect middleware
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await findOrdersByUserId(req.user.id);
    res.status(HTTP_STATUS.OK).json({ status: "success", data: { orders } });
  } catch (err) {
    next(err);
  }
};