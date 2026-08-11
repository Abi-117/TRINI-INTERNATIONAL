import { Navigate } from "@tanstack/react-router";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const token =
  typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;
  

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;