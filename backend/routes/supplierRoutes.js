import express from "express";

import {
  addSupplier,
  deleteSupplier,
  getSuppliers,
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", getSuppliers);
router.post("/", addSupplier);
router.delete("/:id", deleteSupplier);

export default router;
