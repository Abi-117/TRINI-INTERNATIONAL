import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { commerceService } from "@/services/commerce.service";
import { deliveryEstimate, inr } from "@/lib/format";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — TRINI INTERNATIONAL" },
      { name: "description", content: "Your Trini International order is confirmed and being packed." },
      { property: "og:title", content: "Order Confirmed — TRINI INTERNATIONAL" },
      { property: "og:description", content: "Your order is confirmed and being packed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => commerceService.getOrder(orderId),
  });

  return (
    <section className="container-x flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-xl rounded-[2rem] glass p-10 shadow-soft">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-6 text-center text-3xl font-bold">Order confirmed</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Thank you! Your order {order ? `#${order.orderNumber}` : ""} is being packed for same-day dispatch.
        </p>

        {order && (
          <>
            <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              {order.items.map((i) => (
                <li key={i.productId + (i.variant ?? "")} className="flex justify-between gap-3">
                  <span className="line-clamp-1 text-muted-foreground">{i.title} × {i.quantity}</span>
                  <span className="font-medium">{inr(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
              <span>Total paid</span>
              <span className="text-gold">{inr(order.total)}</span>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 text-primary" /> Estimated delivery by {deliveryEstimate(4)}
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" asChild>
            <Link to="/account/orders">Track order</Link>
          </Button>
          <Button variant="glass" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
