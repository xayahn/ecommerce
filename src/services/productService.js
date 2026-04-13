/**
 * productService.js
 * All product-related API calls.
 */

import api from "../api/axiosInstance.js";

export const productService = {
  /**
   * @param {{ page?, limit?, collection?, search?, sortBy? }} params
   */
  getProducts: (params = {}) =>
    api.get("/products", { params }).then((r) => r.data.data),

  /** @param {string} handle */
  getProductByHandle: (handle) =>
    api.get(`/products/handle/${handle}`).then((r) => r.data.data),

  getCollections: () =>
    api.get("/products/collections").then((r) => r.data.data.collections),
};