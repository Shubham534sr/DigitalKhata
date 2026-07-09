import express from "express";

import {
  addCredit,
  addSupplierPurchase,
  deleteCredit,
  deleteSupplierPurchase,
  getCreditSummary,
  getCredits,
  getSupplierPurchases,
  updateCredit,
  updateSupplierPurchase,
} from "../controllers/creditController.js";

const router = express.Router();

router.get("/summary", getCreditSummary);

router.get("/supplier-purchases", getSupplierPurchases);
router.post("/supplier-purchases", addSupplierPurchase);
router.put("/supplier-purchases/:id", updateSupplierPurchase);
router.delete("/supplier-purchases/:id", deleteSupplierPurchase);

router.get("/customer-credits", getCredits);
router.post("/customer-credits", addCredit);
router.put("/customer-credits/:id", updateCredit);
router.delete("/customer-credits/:id", deleteCredit);

router.post("/add", addCredit);
router.get("/", getCredits);
router.delete("/:id", deleteCredit);

export default router;
