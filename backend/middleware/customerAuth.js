import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectCustomer = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const customer = await User.findById(decoded.id).select(
        "-password"
      );

      if (!customer) {
        return res.status(401).json({
          success: false,
          message: "Customer not found",
        });
      }

      req.customer = customer;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};