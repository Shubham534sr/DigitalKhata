import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import "./config/db.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/collections", collectionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Khata API Running Successfully 🚀",
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});




// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
