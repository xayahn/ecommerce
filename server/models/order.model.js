/**
 * order.model.js
 * Data access layer for orders.
 */

import prisma from "../settings/db.js";

/**
 * @param {{
 *   userId?: string,
 *   email: string,
 *   lineItems: Array<{ productId, variantId, title, variantTitle, quantity, price, imageSrc }>,
 *   subtotalPrice: number,
 *   totalTax: number,
 *   totalPrice: number,
 *   shippingAddress: object,
 *   discountCode?: string,
 *   discountAmount?: number,
 *   paymentMethod?: string,
 * }} data
 */
export const createOrder = async (data) => {
  const { lineItems, ...orderFields } = data;

  return prisma.order.create({
    data: {
      ...orderFields,
      lineItems: { create: lineItems },
    },
    include: { lineItems: true },
  });
};

/** @param {string} id */
export const findOrderById = async (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: { lineItems: true, user: { select: { email: true, firstName: true, lastName: true } } },
  });
};

/** @param {string} userId */
export const findOrdersByUserId = async (userId) => {
  return prisma.order.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    include: { lineItems: { include: { product: { include: { images: { take: 1 } } } } } },
  });
};

/**
 * @param {string} id
 * @param {{ status?, financialStatus?, fulfillmentStatus? }} updates
 */
export const updateOrderStatus = async (id, updates) => {
  return prisma.order.update({ where: { id }, data: updates });
};