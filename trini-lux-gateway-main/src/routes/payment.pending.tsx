import { createFileRoute } from "@tanstack/react-router";

import { PaymentResult, meta } from "@/routes/payment.success";

export const Route = createFileRoute("/payment/pending")({
  head: () => meta("Payment Pending — TRINI INTERNATIONAL", "Your payment is awaiting bank confirmation."),
  component: () => <PaymentResult status="pending" />,
});
