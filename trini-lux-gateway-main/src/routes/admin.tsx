import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminLayout from "@/components/layout/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}