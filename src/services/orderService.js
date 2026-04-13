/**
 * orderService.js
 * All order-related API calls.
 */

import api from "../api/axiosInstance.js";

export const orderService = {
  placeOrder: (payload) =>
    api.post("/orders", payload).then((r) => r.data.data.order),

  getOrder: (id) =>
    api.get(`/orders/${id}`).then((r) => r.data.data.order),

  getMyOrders: () =>
    api.get("/orders/my-orders").then((r) => r.data.data.orders),
};