import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute(){
    const { user, loading } = useAuth();
    if (loading) return <div className="p-6">Cargando…</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}
