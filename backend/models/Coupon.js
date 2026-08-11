
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // ----------------------------------------------
    // COUPON CODE
    // Example: TRINI10
    // ----------------------------------------------
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // ----------------------------------------------
    // DESCRIPTION
    // ----------------------------------------------
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ----------------------------------------------
    // DISCOUNT TYPE
    // percentage = 10%
    // fixed = ₹500
    // ----------------------------------------------
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // ----------------------------------------------
    // DISCOUNT VALUE
    // percentage => 10
    // fixed => 500
    // ----------------------------------------------
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    // ----------------------------------------------
    // MINIMUM ORDER VALUE
    // Example: ₹2000
    // ----------------------------------------------
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ----------------------------------------------
    // MAXIMUM DISCOUNT
    //
    // Mainly useful for percentage coupons.
    //
    // Example:
    // 10% discount
    // Maximum discount ₹500
    // ----------------------------------------------
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    // ----------------------------------------------
    // COUPON START DATE
    // ----------------------------------------------
    startDate: {
      type: Date,
      default: Date.now,
    },

    // ----------------------------------------------
    // COUPON EXPIRY DATE
    // ----------------------------------------------
    expiryDate: {
      type: Date,
      required: true,
    },

    // ----------------------------------------------
    // ACTIVE / INACTIVE
    // ----------------------------------------------
    isActive: {
      type: Boolean,
      default: true,
    },

    // ----------------------------------------------
    // USAGE LIMIT
    //
    // null = unlimited
    // ----------------------------------------------
    usageLimit: {
      type: Number,
      default: null,
      min: 0,
    },

    // ----------------------------------------------
    // HOW MANY TIMES USED
    // ----------------------------------------------
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);

