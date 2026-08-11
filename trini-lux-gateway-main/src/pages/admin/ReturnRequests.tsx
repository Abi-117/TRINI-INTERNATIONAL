import { useEffect, useState } from "react";
import { getReturnRequests } from "@/services/admin.service";

export default function ReturnRequests() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const token =
      localStorage.getItem("adminToken") || "";

    const res =
      await getReturnRequests(token);

    setOrders(res.orders);
  };

  return (
    <div>

      <h1 className="mb-6 text-3xl font-bold">
        Return Requests
      </h1>

      <table className="w-full border">

        <thead>

          <tr>

            <th>Order</th>

            <th>Customer</th>

            <th>Reason</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((o) => (

            <tr key={o._id}>

              <td>{o._id.slice(-8)}</td>

              <td>{o.customer?.name}</td>

              <td>{o.returnReason}</td>

              <td>{o.returnStatus}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}