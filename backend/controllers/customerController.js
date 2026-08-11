import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import generateCustomerToken from "../utils/generateCustomerToken.js";
import CustomerOTP from "../models/CustomerOTP.js";
import sendCustomerOTP from "../utils/sendCustomerOTP.js";
import Order from "../models/Order.js";

export const signupCustomer = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, phone, password } = req.body;

    // Check existing customer
    const existingCustomer = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: "customer",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",

      token: generateCustomerToken(customer._id),

      user: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const customer = await User.findOne({
      email: email.toLowerCase(),
      role: "customer",
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      customer.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",

      token: generateCustomerToken(customer._id),

      user: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCustomerProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      customer: req.customer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await User.findById(req.customer._id);

    customer.name = req.body.name || customer.name;
    customer.phone = req.body.phone || customer.phone;

    await customer.save();

    res.json({
      success: true,
      message: "Profile updated",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    const customer = await User.findOne({
      email,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await CustomerOTP.deleteMany({
      email,
    });

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await CustomerOTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    await sendCustomerOTP(
      email,
      otp
    );

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

export const verifyOTP = async (
  req,
  res
) => {

  const { email, otp } = req.body;

  const record =
    await CustomerOTP.findOne({
      email,
      otp,
    });

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (
    record.expiresAt < new Date()
  ) {
    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  res.json({
    success: true,
    message: "OTP Verified",
  });

};

export const resetPassword = async (
  req,
  res
) => {

  const {
    email,
    otp,
    password,
  } = req.body;

  const record =
    await CustomerOTP.findOne({
      email,
      otp,
    });

  if (!record) {

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });

  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  await User.findOneAndUpdate(
    {
      email,
      role: "customer",
    },
    {
      password: hashedPassword,
    }
  );

  await CustomerOTP.deleteMany({
    email,
  });

  res.json({
    success: true,
    message: "Password Reset Successfully",
  });

};




export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({
          customer: customer._id,
        });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.total,
          0
        );

        return {
          ...customer.toObject(),
          totalOrders,
          totalSpent,
        };
      })
    );

    res.json({
      success: true,
      total: result.length,
      customers: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};