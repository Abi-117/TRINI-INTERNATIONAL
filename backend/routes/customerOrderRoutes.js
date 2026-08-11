import express from "express";

import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/customerOrderController.js";

import { protectCustomer } from "../middleware/customerAuth.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

// Place Order
router.post("/", protectCustomer, placeOrder);

// Get Logged-in Customer Orders
router.get("/", protectCustomer, getMyOrders);

// Get Single Order
router.get("/:id", protectCustomer, getOrderById);

// Admin
router.get("/admin/all", protectAdmin, getAllOrders);

router.get("/admin/:id", protectAdmin, getSingleOrder);

router.put("/admin/:id", protectAdmin, updateOrderStatus);

export default router;