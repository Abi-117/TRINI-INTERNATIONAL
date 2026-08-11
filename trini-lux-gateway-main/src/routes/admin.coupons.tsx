
import {
  createFileRoute,
  Outlet,
} from "@tanstack/react-router";
import Coupons from "@/pages/admin/AdminCoupons";

export const Route = createFileRoute("/admin/coupons")({
  component: Coupons,
});