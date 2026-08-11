import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layout/AdminLayout";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw redirect({
        to: "/admin/login",
      });
    }
  },

  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});