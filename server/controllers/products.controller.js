/**
 * products.controller.js
 * Handles all product and collection HTTP requests.
 * Calls model layer — never touches Prisma directly.
 */

import {
  findManyProducts,
  findProductByHandle,
  findRelatedProducts,
  findAllCollections,
} from "../models/product.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { PAGINATION, HTTP_STATUS } from "../settings/constants.js";

/**
 * GET /api/v1/products
 * Query params: page, limit, collection, search, sortBy
 */
export const getProducts = async (req, res, next) => {
  try {
    const page       = Math.max(1, parseInt(req.query.page,  10) || PAGINATION.DEFAULT_PAGE);
    const limit      = Math.min(
      parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const collection = req.query.collection || undefined;
    const search     = req.query.search     || undefined;
    const sortBy     = req.query.sortBy     || "createdAt";

    const result = await findManyProducts({ page, limit, collectionHandle: collection, search, sortBy });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data:   result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/products/:handle
 */
export const getProductByHandle = async (req, res, next) => {
  try {
    const product = await findProductByHandle(req.params.handle);

    if (!product) {
      throw new AppError(`Product "${req.params.handle}" not found.`, 404);
    }

    // Fetch related products from same collection
    const collectionId = product.collections?.[0]?.collection?.id;
    const related = collectionId
      ? await findRelatedProducts(product.id, collectionId)
      : [];

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data:   { product, related },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/collections
 */
export const getCollections = async (_req, res, next) => {
  try {
    const collections = await findAllCollections();

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data:   { collections },
    });
  } catch (err) {
    next(err);
  }
};