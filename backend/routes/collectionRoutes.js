import express from "express";

import {
  addProduct,
  deleteProduct,
  getCollectionSummary,
  getProducts,
  getStockHistory,
  updateProduct,
  updateStock,
} from "../controllers/collectionController.js";

const router = express.Router();

router.get("/summary", getCollectionSummary);
router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/stock", updateStock);
router.delete("/products/:id", deleteProduct);
router.get("/history", getStockHistory);

export default router;
