
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";

export const createOrder = async (req, res) => {
  try {
    const customer = req.customer._id;

    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      discount = 0,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    // ------------------------------------------
    // PRODUCTS
    // ------------------------------------------

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const itemPrice = product.price;

      subtotal += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant || "",
      });
    }

    // ------------------------------------------
    // SHIPPING CHARGE
    // ------------------------------------------

    const normalizedState =
      shippingAddress.state?.trim().toLowerCase();

    const shippingCharge =
      normalizedState === "tamil nadu" ||
      normalizedState === "tamilnadu"
        ? 99
        : 130;

    // ------------------------------------------
    // COUPON
    // ------------------------------------------

    // -----------------------------
// COUPON
// -----------------------------

let couponDiscount = 0;
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
      message:
        `Minimum order amount is ₹${coupon.minOrderAmount}`,
    });
  }

  // Calculate discount
  if (coupon.discountType === "percentage") {
    couponDiscount =
      (subtotal * coupon.discountValue) / 100;

    if (
      coupon.maxDiscountAmount !== null &&
      coupon.maxDiscountAmount !== undefined
    ) {
      couponDiscount = Math.min(
        couponDiscount,
        coupon.maxDiscountAmount
      );
    }
  } else {
    couponDiscount = coupon.discountValue;
  }

  // Discount cannot exceed subtotal
  couponDiscount = Math.min(
    couponDiscount,
    subtotal
  );

  appliedCouponCode = coupon.code;

  // IMPORTANT:
  // Increase coupon usage count
  coupon.usedCount += 1;

  await coupon.save();
}

// -----------------------------
// FINAL TOTAL
// -----------------------------

const total = Math.max(
  0,
  subtotal - couponDiscount + shippingCharge
);

    // ------------------------------------------
    // FINAL TOTAL
    // ------------------------------------------

    

    // ------------------------------------------
    // CREATE ORDER
    // ------------------------------------------

    const order = await Order.create({
      customer,

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
        paymentMethod === "razorpay"
          ? "razorpay"
          : "cod",

      paymentStatus:
        paymentMethod === "razorpay"
          ? "Paid"
          : "Pending",

      orderStatus: "Pending",

      // PRICE DETAILS
      subtotal,
      discount: couponDiscount,
      couponCode: appliedCouponCode,
      shippingCharge,
      total,
    });

    // ------------------------------------------
    // REDUCE STOCK
    // ------------------------------------------

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.customer._id,
    })
      .populate("customer", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrder = async (
  req,
  res
) => {

  const order =
    await Order.findById(
      req.params.id
    )
      .populate("address")
      .populate("items.product");

  res.json({
    success: true,
    order,
  });

};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.product", "name image price");

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
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateShipment = async (req, res) => {
  try {
    const {
      trackingNumber,
      courier,
      dispatchDate,
      expectedDelivery,
    } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        trackingNumber,
        courier,
        dispatchDate,
        expectedDelivery,
      },
      {
        new: true,
      }
    );

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

export const getCustomerOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.customer.id,
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

export const requestCancelOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.customer.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Processing"
    ) {
      return res.status(400).json({
        message:
          "Order cannot be cancelled",
      });
    }

    order.cancelRequested = true;

    order.cancelStatus = "Pending";

    order.cancelReason =
      req.body.reason;

    await order.save();

    res.json({
      success: true,
      message:
        "Cancellation Request Sent",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const requestReturnOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.customer.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.orderStatus !==
      "Delivered"
    ) {
      return res.status(400).json({
        message:
          "Return available only after delivery",
      });
    }

    order.returnRequested = true;

    order.returnStatus = "Pending";

    order.returnReason =
      req.body.reason;

    await order.save();

    res.json({
      success: true,
      message:
        "Return Request Sent",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


  export const getCancelRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      cancelRequested: true,
    })
      .populate("customer", "name email")
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

export const getReturnRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      returnRequested: true,
    })
      .populate("customer", "name email")
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

export const updateCancelStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("customer", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.cancelStatus = status;

    if (status === "Approved") {
      order.orderStatus = "Cancelled";
    }

    await order.save();

    // Email notification can be added here

    res.json({
      success: true,
      message: "Cancellation status updated",
      order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("customer", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.returnStatus = status;

    await order.save();

    // Email notification here

    res.json({
      success: true,
      message: "Return status updated",
      order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Get all orders error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};