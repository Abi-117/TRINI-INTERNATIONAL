
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — TRINI INTERNATIONAL" },
      {
        name: "description",
        content: "Track and review your Trini International orders.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),

  component: OrdersPage,
});

function OrdersPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
  });

  console.log("ORDERS PAGE DATA:", data);

  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="rounded-3xl glass p-10 text-sm text-muted-foreground">
        Loading orders...
      </div>
    );
  }

  if (isError) {
    console.error("Orders error:", error);

    return (
      <div className="rounded-3xl glass p-10 text-center">
        <p className="text-lg font-semibold text-destructive">
          Failed to load orders
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please login again and try.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl glass p-14 text-center">
        <p className="text-lg font-semibold">
          No orders yet
        </p>

        <Button
          variant="hero"
          className="mt-6"
          asChild
        >
          <Link to="/shop">
            Start shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {orders.map((order: any) => (
        <article
          key={order._id}
          className="rounded-3xl glass p-6"
        >

          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <p className="font-display text-sm font-bold text-primary">
                #
                <Link
                  to="/account/orders/$id"
                  params={{
                    id: order._id,
                  }}
                  className="ml-1 text-blue-600 hover:underline"
                >
                  {order._id
                    .slice(-8)
                    .toUpperCase()}
                </Link>
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary">
              {order.orderStatus}
            </span>

          </div>

          {/* PRODUCTS */}
          <div className="mt-5 space-y-3">

            {order.items?.map((item: any) => (
              <div
                key={`${item.product}-${item.variant ?? ""}`}
                className="flex items-center justify-between gap-4"
              >

                <div className="flex items-center gap-3">

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-14 rounded-xl object-cover"
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>

                    {item.variant && (
                      <p className="text-xs text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
                  </div>

                </div>

                <p className="text-sm font-medium">
                  {inr(
                    item.price * item.quantity
                  )}
                </p>

              </div>
            ))}

          </div>

          {/* ADDRESS */}
          {order.shippingAddress && (
            <div className="mt-5 rounded-2xl border border-border p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Delivery Address
              </p>

              <p className="mt-2 text-sm font-semibold">
                {order.shippingAddress.fullName}
              </p>

              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.phone}
              </p>

              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.line1}
              </p>

              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                -{" "}
                {order.shippingAddress.pincode}
              </p>

            </div>
          )}

          {/* PAYMENT + TOTAL */}
          <div className="mt-5 border-t border-border pt-4">

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Payment
              </span>

              <span className="font-medium capitalize">
                {order.paymentMethod}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Payment Status
              </span>

              <span className="font-medium">
                {order.paymentStatus}
              </span>
            </div>

            <div className="mt-3 flex justify-between text-base font-bold">
              <span>Total</span>

              <span className="text-gold">
                {inr(order.total)}
              </span>
            </div>

          </div>

        </article>
      ))}

    </div>
  );
}