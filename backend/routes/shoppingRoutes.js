import express from "express";

import {
  createOrder,
  getOrders,
  getShoppingProducts,
  updateOrderStatus,
} from "../controllers/shoppingController.js";

const router = express.Router();

router.get("/products", getShoppingProducts);
router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.patch("/orders/:id/status", updateOrderStatus);

export default router;
