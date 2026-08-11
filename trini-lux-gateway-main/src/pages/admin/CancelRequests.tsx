import { useEffect, useState } from "react";
import { getCancelRequests } from "@/services/admin.service";
import { toast } from "sonner";

import {
  updateCancelRequest,
} from "@/services/admin.service";


export default function CancelRequests() {
  const [orders, setOrders] = useState<any[]>([]);
    const token =
  localStorage.getItem("adminToken") || "";
  useEffect(() => {
    load();
  }, []);
  const updateStatus = async (
  id: string,
  status: string
) => {
  try {
    await updateCancelRequest(
      id,
      status,
      token
    );

    toast.success("Updated");

    load();

  } catch {

    toast.error("Failed");

  }
};

  const load = async () => {
    const token =
      localStorage.getItem("adminToken") || "";

    const res =
      await getCancelRequests(token);

    setOrders(res.orders);
  };

  return (
    <div>

      <h1 className="mb-6 text-3xl font-bold">
        Cancellation Requests
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

              <td>{o.cancelReason}</td>

              <td>

<span
  className={`rounded-full px-3 py-1 text-sm font-medium

${
o.cancelStatus === "Approved"
? "bg-green-100 text-green-700"

: o.cancelStatus === "Rejected"

? "bg-red-100 text-red-700"

: "bg-yellow-100 text-yellow-700"
}`}

>

{o.cancelStatus}

</span>

</td>

<td>

{o.cancelStatus === "Pending" && (

<>

<button

onClick={() =>
updateStatus(
o._id,
"Approved"
)
}

className="mr-2 rounded bg-green-600 px-3 py-1 text-white"

>

Approve

</button>

<button

onClick={() =>
updateStatus(
o._id,
"Rejected"
)
}

className="rounded bg-red-600 px-3 py-1 text-white"

>

Reject

</button>

</>

)}

</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}