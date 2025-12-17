import { Loader } from "@christianai/ui";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/use-auth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { userAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (!userAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
