import { Navigate } from "@tanstack/react-router";
import { useStore } from "@/store/store-provider";

export default function RequireCustomer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer } = useStore();

  if (!customer) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}