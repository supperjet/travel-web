import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export function RequireAuth() {
  const { identity, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="page-status">正在确认登录状态…</div>;
  if (!identity) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
