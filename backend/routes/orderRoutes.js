import express from "express";

import {
  createOrder,
  getCustomerOrders,
  getOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateShipment,
  getCustomerOrder,
  requestCancelOrder,
  requestReturnOrder,
  updateCancelStatus,
  updateReturnStatus,
  getCancelRequests,
  getReturnRequests,
} from "../controllers/orderController.js";

import { downloadInvoice } from "../controllers/invoiceController.js";

import {
  protectCustomer,
} from "../middleware/customerMiddleware.js";

import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   CUSTOMER ROUTES
===================================================== */

// Create order
router.post(
  "/",
  protectCustomer,
  createOrder
);

// Customer orders
router.get(
  "/",
  protectCustomer,
  getCustomerOrders
);

// Customer single order
router.get(
  "/:id",
  protectCustomer,
  getOrder
);

// Customer specific order
router.get(
  "/customer/orders/:id",
  protectCustomer,
  getCustomerOrder
);

// Cancel order
router.put(
  "/customer/orders/:id/cancel",
  protectCustomer,
  requestCancelOrder
);

// Return order
router.put(
  "/customer/orders/:id/return",
  protectCustomer,
  requestReturnOrder
);


/* =====================================================
   ADMIN ROUTES
===================================================== */

// Get all orders
router.get(
  "/admin/all",
  protectAdmin,
  getAllOrders
);

// Get single order
router.get(
  "/admin/orders/:id",
  protectAdmin,
  getOrderById
);

// Update order status
router.put(
  "/admin/orders/:id/status",
  protectAdmin,
  updateOrderStatus
);

// Update shipment
router.put(
  "/admin/orders/:id/shipment",
  protectAdmin,
  updateShipment
);

// Download invoice
router.get(
  "/admin/orders/:id/invoice",
  protectAdmin,
  downloadInvoice
);

// Cancellation requests
router.get(
  "/admin/cancel-requests",
  protectAdmin,
  getCancelRequests
);

// Return requests
router.get(
  "/admin/return-requests",
  protectAdmin,
  getReturnRequests
);

// Update cancellation status
router.put(
  "/admin/orders/:id/cancel-status",
  protectAdmin,
  updateCancelStatus
);

// Update return status
router.put(
  "/admin/orders/:id/return-status",
  protectAdmin,
  updateReturnStatus
);

export default router;