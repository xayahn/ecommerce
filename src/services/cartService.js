/**
 * cartService.js
 * All cart-related API calls.
 */

import api from "../api/axiosInstance.js";

export const cartService = {
  getCart: () =>
    api.get("/cart").then((r) => r.data.data.cart),

  createCart: () =>
    api.post("/cart").then((r) => {
      const { cart } = r.data.data;
      localStorage.setItem("cart_token", cart.token);
      return cart;
    }),

  addItem: (cartToken, productId, variantId, quantity = 1) =>
    api.post("/cart/items", { cartToken, productId, variantId, quantity })
       .then((r) => r.data.data.cart),

  updateItem: (cartToken, variantId, quantity) =>
    api.patch("/cart/items", { cartToken, variantId, quantity })
       .then((r) => r.data.data.cart),

  removeItem: (variantId) =>
    api.delete(`/cart/items/${variantId}`).then((r) => r.data.data.cart),

  clearCart: () =>
    api.delete("/cart/clear").then((r) => r.data),

  applyPromo: (code) =>
    api.post("/cart/promo", { code }).then((r) => r.data.data.promo),
};