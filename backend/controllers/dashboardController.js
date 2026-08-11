import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$total",
          },
        },
      },
    ]);
    const currentMonth = new Date().getMonth() + 1;

const currentMonthRevenue = await Order.aggregate([
  {
    $match: {
      paymentStatus: "Paid",
      $expr: {
        $eq: [{ $month: "$createdAt" }, currentMonth],
      },
    },
  },
  {
    $group: {
      _id: null,
      revenue: { $sum: "$total" },
    },
  },
]);

const lastMonthRevenue = await Order.aggregate([
  {
    $match: {
      paymentStatus: "Paid",
      $expr: {
        $eq: [{ $month: "$createdAt" }, currentMonth - 1],
      },
    },
  },
  {
    $group: {
      _id: null,
      revenue: { $sum: "$total" },
    },
  },
]);

const currentRevenue =
  currentMonthRevenue[0]?.revenue || 0;

const previousRevenue =
  lastMonthRevenue[0]?.revenue || 0;

const growth =
  previousRevenue === 0
    ? 100
    : (
        ((currentRevenue - previousRevenue) /
          previousRevenue) *
        100
      ).toFixed(2);

      const lowStock = await Product.find({
  stock: { $lt: 10 },
})
.select("name stock")
.limit(5);
const recentCustomers = await Customer.find()
.sort({ createdAt: -1 })
.limit(5)
.select("name email");



    const revenue =
      revenueData.length > 0
        ? revenueData[0].revenue
        : 0;

    const latestOrders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
        },
      },
      {
        $sort: {
          "_id": 1,
        },
      },
    ]);

    const topProducts = await Order.aggregate([
  { $unwind: "$items" },

  {
    $group: {
      _id: "$items.product",
      sold: {
        $sum: "$items.quantity",
      },
    },
  },

  {
    $sort: {
      sold: -1,
    },
  },

  {
    $limit: 5,
  },

  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product",
    },
  },
]);

    res.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      revenue,
      latestOrders,
      orderStatus,
      monthlySales,
      growth,
      lowStock,
      recentCustomers,
      topProducts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Dashboard Error",
    });
  }
};