import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// ======================================
// PLACE ORDER
// ======================================

// ======================================
// PLACE ORDER
// ======================================

export const placeOrder = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      couponCode,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // -----------------------------
    // CALCULATE SUBTOTAL FROM DB
    // -----------------------------

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      // IMPORTANT:
      // Always use original/current product price from DB
      const itemPrice = Number(product.price);
      const quantity = Number(item.quantity);

      subtotal += itemPrice * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        quantity,
        price: itemPrice,
        variant: item.variant || "",
      });
    }

    // -----------------------------
    // SHIPPING CHARGE
    // -----------------------------

    const normalizedState =
      shippingAddress.state?.trim().toLowerCase();

    const shippingCharge =
      normalizedState === "tamil nadu" ||
      normalizedState === "tamilnadu"
        ? 99
        : 130;

    // -----------------------------
    // COUPON
    // -----------------------------

    let finalDiscount = 0;
    let appliedCouponCode = "";

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon",
        });
      }

      // Start date
      if (
        coupon.startDate &&
        new Date() < new Date(coupon.startDate)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon is not active yet",
        });
      }

      // Expiry
      if (
        coupon.expiryDate &&
        new Date() > new Date(coupon.expiryDate)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      // Usage limit
      if (
        coupon.usageLimit !== null &&
        coupon.usageLimit !== undefined &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      // Minimum order
      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
        });
      }

      // Calculate discount from DB coupon
      if (coupon.discountType === "percentage") {
        finalDiscount =
          (subtotal * coupon.discountValue) / 100;

        if (
          coupon.maxDiscountAmount !== null &&
          coupon.maxDiscountAmount !== undefined
        ) {
          finalDiscount = Math.min(
            finalDiscount,
            coupon.maxDiscountAmount
          );
        }
      } else {
        finalDiscount = coupon.discountValue;
      }

      // Never discount more than subtotal
      finalDiscount = Math.min(
        finalDiscount,
        subtotal
      );

      appliedCouponCode = coupon.code;

      // Increase usage only after successful order creation
    }

    // -----------------------------
    // FINAL TOTAL
    // -----------------------------

    const total = Math.max(
      0,
      subtotal -
        finalDiscount +
        shippingCharge
    );

    // -----------------------------
    // CREATE ORDER
    // -----------------------------

    const order = await Order.create({
      customer: customerId,

      items: orderItems,

      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },

      paymentMethod:
        paymentMethod || "razorpay",

      paymentStatus:
        paymentStatus === "Paid"
          ? "Paid"
          : "Pending",

      razorpayPaymentId:
        razorpayPaymentId || "",

      razorpayOrderId:
        razorpayOrderId || "",

      razorpaySignature:
        razorpaySignature || "",

      // IMPORTANT:
      // These values are calculated fresh from DB
      subtotal,

      discount: finalDiscount,

      shippingCharge,

      total,

      couponCode: appliedCouponCode,

      orderStatus: "Confirmed",
    });

    // -----------------------------
    // UPDATE COUPON USAGE
    // -----------------------------

    if (appliedCouponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: appliedCouponCode,
        },
        {
          $inc: {
            usedCount: 1,
          },
        }
      );
    }

    // -----------------------------
    // REDUCE STOCK
    // -----------------------------

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -Number(item.quantity),
          },
        }
      );
    }

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",

      order,

      payment: {
        subtotal,
        discount: finalDiscount,
        shippingCharge,
        total,
      },
    });
  } catch (err) {
    console.error(
      "PLACE ORDER ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// GET MY ORDERS
// ======================================

export const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      customer: req.customer._id,
    })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ======================================
// GET SINGLE ORDER
// ======================================

export const getOrderById = async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =====================================
// ADMIN - GET ALL ORDERS
// =====================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================
// ADMIN - GET SINGLE ORDER
// =====================================

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.product", "name images price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================
// ADMIN - UPDATE ORDER STATUS
// =====================================

export const updateOrderStatus = async (req, res) => {
  try {

    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};