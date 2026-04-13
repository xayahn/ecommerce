/**
 * api/v1/index.js
 * Mounts all v1 routes under /api/v1
 */

import { Router } from "express";
import productRoutes from "../../routes/products.routes.js";
import cartRoutes    from "../../routes/cart.routes.js";
import orderRoutes   from "../../routes/orders.routes.js";
import authRoutes    from "../../routes/auth.routes.js";

const router = Router();

router.use("/products",    productRoutes);
router.use("/cart",        cartRoutes);
router.use("/orders",      orderRoutes);
router.use("/auth",        authRoutes);

/** API health check */
router.get("/ping", (_req, res) => {
  res.json({ status: "success", message: "API v1 is alive 🚀" });
});

export default router;