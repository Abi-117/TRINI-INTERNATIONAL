import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button"; 

export default function OrderTrackingPage() {
  const { id } = useParams({
    from: "/account/orders/$id",
  });

  const [order, setOrder] = useState<any>();
  const [reason, setReason] =
  useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const res = await orderService.getMyOrder(id);
    setOrder(res.order);
  };

  if (!order) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Track Order
      </h1>

      <div className="rounded-xl border p-6">

        <h2 className="text-xl font-bold">
          Order #{order._id.slice(-8)}
        </h2>

        <p className="mt-3">
          Status :
          {" "}
          <strong>{order.orderStatus}</strong>
        </p>

        <p>
          Courier :
          {" "}
          {order.courier || "-"}
        </p>

        <p>
          Tracking Number :
          {" "}
          {order.trackingNumber || "-"}
        </p>

        <p>
          Dispatch :
          {" "}
          {order.dispatchDate
            ? new Date(order.dispatchDate).toLocaleDateString()
            : "-"}
        </p>

        <p>
          Expected Delivery :
          {" "}
          {order.expectedDelivery
            ? new Date(order.expectedDelivery).toLocaleDateString()
            : "-"}
        </p>
        <textarea
  className="mt-6 w-full rounded border p-3"
  rows={4}
  placeholder="Reason..."
  value={reason}
  onChange={(e)=>
    setReason(e.target.value)
  }
/>
<Button
  onClick={async () => {
    await orderService.requestCancel(
      order._id,
      reason
    );

    alert("Request Sent");
  }}
>
  Cancel Order
</Button>
<Button
  onClick={async () => {
    await orderService.requestReturn(
      order._id,
      reason
    );

    alert("Return Requested");
  }}
>
  Request Return
</Button>

      </div>

    </div>
  );
}