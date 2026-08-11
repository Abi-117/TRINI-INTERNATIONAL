import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const states = {
  success: {
    icon: CheckCircle2,
    title: "Payment successful",
    text: "Your payment went through. A confirmation email with your invoice is on the way.",
    tone: "text-success",
  },
  failed: {
    icon: XCircle,
    title: "Payment failed",
    text: "We couldn't complete the transaction. No amount has been deducted — please try again.",
    tone: "text-destructive",
  },
  pending: {
    icon: Clock,
    title: "Payment pending",
    text: "Your bank is still confirming this transaction. We'll update your order the moment it clears.",
    tone: "text-primary",
  },
} as const;

export function PaymentResult({ status }: { status: keyof typeof states }) {
  const s = states[status];
  return (
    <section className="container-x flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-[2rem] glass p-10 text-center shadow-soft">
        <s.icon className={`mx-auto size-14 ${s.tone}`} />
        <h1 className="mt-6 text-3xl font-bold">{s.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" asChild>
            <Link to={status === "failed" ? "/checkout" : "/account/orders"}>
              {status === "failed" ? "Retry payment" : "View my orders"}
            </Link>
          </Button>
          <Button variant="glass" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "robots", content: "noindex" },
  ],
});

export const Route = createFileRoute("/payment/success")({
  head: () => meta("Payment Successful — TRINI INTERNATIONAL", "Your payment was completed successfully."),
  component: () => <PaymentResult status="success" />,
});
