import express from "express";

import {
    addCustomer,
    getCustomers,
    deleteCustomer,
    getCustomerTransactions
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/add", addCustomer);

router.get("/", getCustomers);

router.get("/:id/transactions", getCustomerTransactions);

router.delete("/:id", deleteCustomer);

export default router;