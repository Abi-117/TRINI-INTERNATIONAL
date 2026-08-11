import { createFileRoute } from "@tanstack/react-router";
import ReturnRequests from "@/pages/admin/ReturnRequests";

export const Route = createFileRoute(
  "/admin/return-requests"
)({
  component: ReturnRequests,
});