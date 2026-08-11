import { createFileRoute } from "@tanstack/react-router";

import { PaymentResult, meta } from "@/routes/payment.success";

export const Route = createFileRoute("/payment/failed")({
  head: () => meta("Payment Failed — TRINI INTERNATIONAL", "The payment could not be completed. Please try again."),
  component: () => <PaymentResult status="failed" />,
});
