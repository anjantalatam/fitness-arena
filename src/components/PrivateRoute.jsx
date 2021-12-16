import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();

  return user ? <Navigate to={location.state?.from ?? "/arena"} /> : <Outlet />;
}
