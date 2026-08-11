import Coupon from "../models/Coupon.js";

// ==================================================
// CREATE COUPON
// POST /api/coupons
// ==================================================

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      isActive,
      usageLimit,
    } = req.body;

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type",
      });
    }

    if (
      discountValue === undefined ||
      discountValue === "" ||
      Number(discountValue) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid discount value is required",
      });
    }

    if (!expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date is required",
      });
    }

    // ----------------------------------------------
    // PERCENTAGE VALIDATION
    // ----------------------------------------------

    if (
      discountType === "percentage" &&
      Number(discountValue) > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // ----------------------------------------------
    // FIXED DISCOUNT VALIDATION
    // ----------------------------------------------

    if (
      discountType === "fixed" &&
      Number(discountValue) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid fixed discount",
      });
    }

    // ----------------------------------------------
    // CHECK EXISTING COUPON
    // ----------------------------------------------

    const existingCoupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // ----------------------------------------------
    // DATE VALIDATION
    // ----------------------------------------------

    const start = startDate
      ? new Date(startDate)
      : new Date();

    const expiry = new Date(expiryDate);

    if (Number.isNaN(expiry.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date",
      });
    }

    if (expiry <= start) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date",
      });
    }

    // ----------------------------------------------
    // CREATE
    // ----------------------------------------------

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),

      description:
        description?.trim() || "",

      discountType,

      discountValue:
        Number(discountValue),

      minOrderAmount:
        minOrderAmount !== undefined &&
        minOrderAmount !== ""
          ? Number(minOrderAmount)
          : 0,

      maxDiscountAmount:
        maxDiscountAmount !== undefined &&
        maxDiscountAmount !== ""
          ? Number(maxDiscountAmount)
          : null,

      startDate: start,

      expiryDate: expiry,

      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true,

      usageLimit:
        usageLimit !== undefined &&
        usageLimit !== ""
          ? Number(usageLimit)
          : null,
    });

    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    res.status(201).json({
      success: true,
      message: "Coupon Created Successfully",
      coupon,
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create coupon",
    });
  }
};

// ==================================================
// GET ALL COUPONS
// GET /api/coupons
// ==================================================

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to get coupons",
    });
  }
};

// ==================================================
// GET SINGLE COUPON
// GET /api/coupons/:id
// ==================================================

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error(
      "GET COUPON ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to get coupon",
    });
  }
};

// ==================================================
// UPDATE COUPON
// PUT /api/coupons/:id
// ==================================================

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      isActive,
      usageLimit,
    } = req.body;

    // ----------------------------------------------
    // CODE
    // ----------------------------------------------

    if (code !== undefined) {
      const newCode =
        code.trim().toUpperCase();

      const existingCoupon =
        await Coupon.findOne({
          code: newCode,
          _id: {
            $ne: req.params.id,
          },
        });

      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      coupon.code = newCode;
    }

    // ----------------------------------------------
    // BASIC FIELDS
    // ----------------------------------------------

    if (description !== undefined) {
      coupon.description =
        description.trim();
    }

    if (discountType !== undefined) {
      if (
        !["percentage", "fixed"].includes(
          discountType
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type",
        });
      }

      coupon.discountType =
        discountType;
    }

    if (
      discountValue !== undefined &&
      discountValue !== ""
    ) {
      coupon.discountValue =
        Number(discountValue);
    }

    if (
      minOrderAmount !== undefined &&
      minOrderAmount !== ""
    ) {
      coupon.minOrderAmount =
        Number(minOrderAmount);
    }

    if (
      maxDiscountAmount !== undefined
    ) {
      coupon.maxDiscountAmount =
        maxDiscountAmount === ""
          ? null
          : Number(maxDiscountAmount);
    }

    if (startDate !== undefined) {
      coupon.startDate =
        new Date(startDate);
    }

    if (expiryDate !== undefined) {
      coupon.expiryDate =
        new Date(expiryDate);
    }

    if (isActive !== undefined) {
      coupon.isActive =
        Boolean(isActive);
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit =
        usageLimit === ""
          ? null
          : Number(usageLimit);
    }

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (
      coupon.discountType === "percentage" &&
      coupon.discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%",
      });
    }

    if (
      coupon.expiryDate <=
      coupon.startDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry date must be after start date",
      });
    }

    // ----------------------------------------------
    // SAVE
    // ----------------------------------------------

    await coupon.save();

    res.json({
      success: true,
      message: "Coupon Updated Successfully",
      coupon,
    });
  } catch (error) {
    console.error(
      "UPDATE COUPON ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update coupon",
    });
  }
};

// ==================================================
// DELETE COUPON
// DELETE /api/coupons/:id
// ==================================================

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Coupon Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "DELETE COUPON ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete coupon",
    });
  }
};

// ==================================================
// VALIDATE COUPON
//
// POST /api/coupons/validate
//
// Customer uses this endpoint
// ==================================================

export const validateCoupon = async (
  req,
  res
) => {
  try {
    const { code, subtotal } = req.body;

    // ----------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Coupon code is required",
      });
    }

    const orderSubtotal =
      Number(subtotal);

    if (
      Number.isNaN(orderSubtotal) ||
      orderSubtotal < 0
    ) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid subtotal",
      });
    }

    // ----------------------------------------------
    // FIND COUPON
    // ----------------------------------------------

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid coupon code",
      });
    }

    // ----------------------------------------------
    // ACTIVE CHECK
    // ----------------------------------------------

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "This coupon is inactive",
      });
    }

    // ----------------------------------------------
    // DATE CHECK
    // ----------------------------------------------

    const now = new Date();

    if (now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        valid: false,
        message:
          "This coupon is not active yet",
      });
    }

    if (now > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "This coupon has expired",
      });
    }

    // ----------------------------------------------
    // USAGE LIMIT
    // ----------------------------------------------

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >=
        coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        valid: false,
        message:
          "This coupon usage limit has been reached",
      });
    }

    // ----------------------------------------------
    // MINIMUM ORDER
    // ----------------------------------------------

    if (
      orderSubtotal <
      coupon.minOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
      });
    }

    // ----------------------------------------------
    // CALCULATE DISCOUNT
    // ----------------------------------------------

    let discount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      discount =
        (orderSubtotal *
          coupon.discountValue) /
        100;

      // ------------------------------------------
      // MAXIMUM DISCOUNT
      // ------------------------------------------

      if (
        coupon.maxDiscountAmount !==
          null &&
        discount >
          coupon.maxDiscountAmount
      ) {
        discount =
          coupon.maxDiscountAmount;
      }
    } else {
      discount =
        coupon.discountValue;
    }

    // ----------------------------------------------
    // DISCOUNT CANNOT EXCEED SUBTOTAL
    // ----------------------------------------------

    discount = Math.min(
      discount,
      orderSubtotal
    );

    // ----------------------------------------------
    // FINAL
    // ----------------------------------------------

    const finalAmount =
      orderSubtotal - discount;

    res.json({
      success: true,
      valid: true,
      message:
        coupon.discountType ===
        "percentage"
          ? `${coupon.discountValue}% discount applied`
          : `₹${coupon.discountValue} discount applied`,

      coupon: {
        id: coupon._id,
        code: coupon.code,
        description:
          coupon.description,

        discountType:
          coupon.discountType,

        discountValue:
          coupon.discountValue,

        minOrderAmount:
          coupon.minOrderAmount,

        maxDiscountAmount:
          coupon.maxDiscountAmount,
      },

      discount,

      subtotal: orderSubtotal,

      finalAmount,
    });
  } catch (error) {
    console.error(
      "VALIDATE COUPON ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      valid: false,
      message:
        error.message ||
        "Failed to validate coupon",
    });
  }
};