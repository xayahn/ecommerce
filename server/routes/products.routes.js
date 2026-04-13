/**
 * products.routes.js
 */
import { Router } from "express";
import { getProducts, getProductByHandle, getCollections } from "../controllers/products.controller.js";

const router = Router();

router.get("/",                   getProducts);
router.get("/handle/:handle",     getProductByHandle);
router.get("/collections",        getCollections);

export default router;