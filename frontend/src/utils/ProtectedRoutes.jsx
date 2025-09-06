import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
