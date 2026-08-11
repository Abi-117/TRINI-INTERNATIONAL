import express from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// ==================================================
// ADMIN
// ==================================================

// CREATE
// POST /api/coupons
router.post("/", createCoupon);

// GET ALL
// GET /api/coupons
router.get("/", getCoupons);

// GET SINGLE
// GET /api/coupons/:id
router.get("/:id", getCouponById);

// UPDATE
// PUT /api/coupons/:id
router.put("/:id", updateCoupon);

// DELETE
// DELETE /api/coupons/:id
router.delete("/:id", deleteCoupon);


// ==================================================
// CUSTOMER
// ==================================================

// VALIDATE
// POST /api/coupons/validate
router.post(
  "/validate",
  validateCoupon
);

export default router;