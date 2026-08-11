import { createFileRoute } from "@tanstack/react-router";
import OrderTrackingPage from "@/pages/account/OrderTrackingPage";

export const Route = createFileRoute(
  "/account/orders/$id"
)({
  component: OrderTrackingPage,
});