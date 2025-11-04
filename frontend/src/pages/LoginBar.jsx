
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export default function LoginBar(){
  const nav = useNavigate();
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm({ resolver: zodResolver(LoginSchema)});
  const [err, setErr] = React.useState("");

  async function onSubmit(values){
    setErr("");
    try{
      await axios.post("/auth/login", values, { withCredentials:true });
      nav("/home");
    }catch(ex){
      setErr(ex?.response?.data?.error || "No se pudo iniciar sesión");
    }
  }

  return (
    <div className="bar-bg flex items-center justify-center p-6">
      <div className="bar-card w-full max-w-md p-6">
        <div className="mb-5">
          <h1 className="bar-title text-2xl font-semibold">🍻 BarSplit</h1>
          <p className="bar-subtitle">Bienvenido de vuelta — inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div>
            <label className="bar-subtitle block mb-1">Email</label>
            <input className="bar-input" placeholder="tucorreo@bar.cl" {...register("email")} />
            {errors.email && <p className="bar-error mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="bar-subtitle block mb-1">Contraseña</label>
            <input type="password" className="bar-input" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="bar-error mt-1">{errors.password.message}</p>}
          </div>

          {err && <p className="bar-error">{err}</p>}

          <button disabled={isSubmitting} className="bar-btn bar-btn-primary mt-1">
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <span className="bar-subtitle">¿No tienes cuenta?</span>
          <Link to="/register" className="bar-link">Crear cuenta</Link>
        </div>

        <div className="mt-5 bar-sep">o</div>

        <div className="mt-4">
          <Link to="/" className="bar-btn bar-btn-ghost w-full text-center">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
