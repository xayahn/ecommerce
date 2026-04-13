/**
 * product.model.js
 * Data access layer for products.
 * All DB queries for products go through here — never query Prisma directly in controllers.
 */

import prisma from "../settings/db.js";

/**
 * @param {{ page: number, limit: number, collectionHandle?: string, search?: string, sortBy?: string }} opts
 */
export const findManyProducts = async ({ page = 1, limit = 12, collectionHandle, search, sortBy = "createdAt" } = {}) => {
  const skip = (page - 1) * limit;

  const where = {
    status: "ACTIVE",
    ...(collectionHandle && {
      collections: { some: { collection: { handle: collectionHandle } } },
    }),
    ...(search && {
      OR: [
        { title:       { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags:        { has: search } },
      ],
    }),
  };

  const orderBy = sortBy === "price_asc"  ? { variants: { _count: "asc"  } }
                : sortBy === "price_desc" ? { variants: { _count: "desc" } }
                : sortBy === "title"      ? { title: "asc" }
                :                          { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        images:   { orderBy: { position: "asc" } },
        variants: true,
        collections: { include: { collection: { select: { id: true, title: true, handle: true } } } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
};

/** @param {string} handle */
export const findProductByHandle = async (handle) => {
  return prisma.product.findUnique({
    where: { handle },
    include: {
      images:   { orderBy: { position: "asc" } },
      variants: true,
      collections: { include: { collection: true } },
    },
  });
};

/** @param {string} id */
export const findProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
};

/**
 * Returns related products from the same collection, excluding current product.
 * @param {string} productId
 * @param {string} collectionId
 * @param {number} limit
 */
export const findRelatedProducts = async (productId, collectionId, limit = 4) => {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { not: productId },
      collections: { some: { collectionId } },
    },
    take: limit,
    include: {
      images:   { orderBy: { position: "asc" }, take: 1 },
      variants: { take: 1 },
    },
  });
};

export const findAllCollections = async () => {
  return prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
};