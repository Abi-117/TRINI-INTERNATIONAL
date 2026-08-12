import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import customerOrderRoutes from "./routes/customerOrderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://trinideploy.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
// Middleware
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use(
  "/api/customer/auth",
  customerRoutes
);
app.use("/api/customer", customerRoutes);
app.use("/api/coupons", couponRoutes);
app.use(
  "/api/address",
  addressRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);
app.use(
  "/api/payments",
  paymentRoutes
);

app.use("/api/customer/orders", customerOrderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Trini Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});