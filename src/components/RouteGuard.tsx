import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";

interface RouteGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RouteGuard({ allowedRoles, redirectTo = "/login" }: RouteGuardProps) {
  const { state } = useAppStore();

  if (!state.currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(state.currentUser.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
