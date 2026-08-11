import { createFileRoute } from "@tanstack/react-router";
import OrderDetails from "@/pages/admin/OrderDetails";

export const Route = createFileRoute(
  "/admin/orders/$id"
)({
  component: OrderDetails,
});