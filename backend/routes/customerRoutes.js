import express from "express";

import {
  signupCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllCustomers,
} from "../controllers/customerController.js";

import {
  protectCustomer,
} from "../middleware/customerMiddleware.js";

import {
  signupValidation,
  loginValidation,
} from "../validators/customerValidator.js";

import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CUSTOMER AUTH
========================= */

router.post(
  "/signup",
  signupValidation,
  signupCustomer
);

router.post(
  "/login",
  loginValidation,
  loginCustomer
);

/* =========================
   CUSTOMER PROFILE
========================= */

router.get(
  "/profile",
  protectCustomer,
  getCustomerProfile
);

router.put(
  "/profile",
  protectCustomer,
  updateCustomerProfile
);

/* =========================
   FORGOT PASSWORD
========================= */

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/reset-password",
  resetPassword
);

/* =========================
   ADMIN - CUSTOMERS
========================= */

router.get(
  "/admin/all",
  protectAdmin,
  getAllCustomers
);

export default router;