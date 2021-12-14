import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: pathname }} />
  );
}
