import express from "express";

import {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
  getPaymentSummary,
  getPaymentCustomers,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/summary", getPaymentSummary);

router.get("/customers", getPaymentCustomers);

router.get("/", getPayments);

router.post("/add", addPayment);

router.put("/:id", updatePayment);

router.delete("/:id", deletePayment);

export default router;
