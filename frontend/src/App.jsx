import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import Layout from "./components/Layout";
import LoginBar from "./pages/LoginBar";
import RegisterBar from "./pages/RegisterBar";
import Home from "./pages/Home";
import Mesa from "./pages/Mesa";
import Historial from "./pages/Historial";
import CrearMesa from "./pages/CrearMesa";

export default function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginBar/>} />
          <Route path="/register" element={<RegisterBar/>} />

          <Route element={<PrivateRoute/>}>
            <Route element={<Layout/>}>
              <Route path="/" element={<Navigate to="/home" replace/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/mesa/:id" element={<Mesa />} />              <Route path="/historial" element={<Historial/>} />
              <Route path="/crear-mesa" element={<CrearMesa />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
