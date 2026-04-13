/**
 * cart.model.js
 * Data access layer for cart operations.
 */

import prisma from "../settings/db.js";

/** @param {string} token */
export const findCartByToken = async (token) => {
  return prisma.cart.findUnique({
    where: { token },
    include: {
      items: {
        include: {
          product: {
            include: {
              images:   { orderBy: { position: "asc" }, take: 1 },
              variants: true,
            },
          },
        },
      },
    },
  });
};

/** @param {string} userId */
export const findCartByUserId = async (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images:   { orderBy: { position: "asc" }, take: 1 },
              variants: true,
            },
          },
        },
      },
    },
  });
};

/** Create an empty cart */
export const createCart = async (userId = null) => {
  return prisma.cart.create({
    data: { userId },
    include: { items: true },
  });
};

/**
 * Add item to cart or increment quantity if already exists.
 * @param {string} cartId
 * @param {string} productId
 * @param {string} variantId
 * @param {number} quantity
 */
export const upsertCartItem = async (cartId, productId, variantId, quantity) => {
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId, variantId } },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { cartId_variantId: { cartId, variantId } },
      data:  { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { cartId, productId, variantId, quantity },
  });
};

/**
 * @param {string} cartId
 * @param {string} variantId
 * @param {number} quantity
 */
export const updateCartItemQuantity = async (cartId, variantId, quantity) => {
  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { cartId_variantId: { cartId, variantId } },
    });
  }
  return prisma.cartItem.update({
    where: { cartId_variantId: { cartId, variantId } },
    data:  { quantity },
  });
};

/**
 * @param {string} cartId
 * @param {string} variantId
 */
export const removeCartItem = async (cartId, variantId) => {
  return prisma.cartItem.delete({
    where: { cartId_variantId: { cartId, variantId } },
  });
};

/** @param {string} cartId */
export const clearCart = async (cartId) => {
  return prisma.cartItem.deleteMany({ where: { cartId } });
};