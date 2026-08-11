import { useEffect, useState } from "react";

import DashboardCard from "@/components/admin/DashboardCard";
import SalesChart from "@/components/admin/SalesChart";
import OrderStatusChart from "@/components/admin/OrderStatusChart";
import { getDashboard } from "@/services/admin.service";

interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
  latestOrders: any[];
  monthlySales: any[];
  orderStatus: any[];
}

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState<DashboardData>({
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      revenue: 0,
      latestOrders: [],
      monthlySales: [],
      orderStatus: [],
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") || "";

        const data =
          await getDashboard(token);

        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Products"
          value={dashboard.totalProducts}
        />

        <DashboardCard
          title="Customers"
          value={dashboard.totalCustomers}
        />

        <DashboardCard
          title="Orders"
          value={dashboard.totalOrders}
        />

        <DashboardCard
          title="Revenue"
          value={`₹${dashboard.revenue}`}
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <SalesChart
          data={dashboard.monthlySales}
        />

        <OrderStatusChart
          data={dashboard.orderStatus}
        />

      </div>

      {/* Latest Orders */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-xl font-bold">
          Latest Orders
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
  {dashboard.latestOrders.slice(0, 5).map((order) => (
    <tr
      key={order._id}
      className="border-b"
    >
      <td className="p-3">
        {order.customer?.name}
      </td>

      <td className="p-3">
        ₹{order.total}
      </td>

      <td className="p-3">
        {order.orderStatus}
      </td>

      <td className="p-3 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
    </tr>
  ))}
</tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;