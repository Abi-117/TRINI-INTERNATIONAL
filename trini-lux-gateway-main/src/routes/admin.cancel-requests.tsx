import { createFileRoute } from "@tanstack/react-router";
import CancelRequests from "@/pages/admin/CancelRequests";

export const Route = createFileRoute(
  "/admin/cancel-requests"
)({
  component: CancelRequests,
});
