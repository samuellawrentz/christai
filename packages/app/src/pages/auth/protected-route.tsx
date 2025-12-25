import { Loader } from "@christianai/ui";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../shared/hooks/use-auth";

export function ProtectedRoute() {
  const { userAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (!userAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
