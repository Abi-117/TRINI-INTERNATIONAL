import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  
} from "@tanstack/react-router";
import { toast } from "sonner";

import {
  getAllOrders,
  updateOrderStatus,
} from "@/services/admin.service";

export const Route = createFileRoute("/admin/order")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        toast.error("Admin login required");
        setLoading(false);
        return;
      }

      const res = await getAllOrders(adminToken);

      setOrders(res.orders || []);
    } catch (error: any) {
      console.error(
        "Failed to load orders:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (
    id: string,
    status: string
  ) => {
    try {
      const adminToken =
        localStorage.getItem("adminToken");

      if (!adminToken) {
        toast.error("Admin login required");
        return;
      }

      await updateOrderStatus(
        id,
        status,
        adminToken
      );

      toast.success("Order Updated");

      await loadOrders();
    } catch (error: any) {
      console.error(
        "Update order error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Update Failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Orders
      </h1>

      <div className="overflow-auto rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Order
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Payment
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t"
                >

                  <td className="p-4">

                    <Link
                      to="/admin/orders/$id"
                      params={{
                        id: order._id,
                      }}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {order._id.slice(-8)}
                    </Link>

                  </td>

                  <td className="p-4">
                    <div className="font-medium">
                      {order.customer?.name || "N/A"}
                    </div>

                    <div className="text-sm text-gray-500">
                      {order.customer?.email || "N/A"}
                    </div>
                  </td>

                  <td className="p-4">
                    ₹{order.total}
                  </td>

                  <td className="p-4 capitalize">
                    {order.paymentMethod}
                  </td>

                  <td className="p-4">

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        changeStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded border p-2"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Packed">
                        Packed
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                  </td>

                  <td className="p-4">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

   

    </div>
  );
}