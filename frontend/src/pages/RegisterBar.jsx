import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../AuthContext";
import "../App.css";

const RegisterSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterBar(){
  const nav = useNavigate();
  const { register: doRegister } = useAuth();
  const { register: formRegister, handleSubmit, formState:{ errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(RegisterSchema)
  });
  const [ok, setOk] = React.useState("");
  const [err, setErr] = React.useState("");

  const submitForm = async (values) => {
    setOk(""); setErr("");
    try {
      await doRegister(values); // { name, email, password }
      setOk("Registro exitoso. Ahora inicia sesión.");
      reset();
      nav("/login");
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div className="bar-bg flex items-center justify-center p-6">
      <div className="bar-card w-full max-w-md p-6">
        <div className="mb-5">
          <h1 className="bar-title text-2xl font-semibold">🍻 Únete a BarSplit</h1>
          <p className="bar-subtitle">Crea tu cuenta para dividir la cuenta con tus amigos</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="grid gap-3">
          <div>
            <label className="bar-subtitle block mb-1">Nombre</label>
            <input className="bar-input" placeholder="Tu nombre" {...formRegister("name")} />
            {errors.name && <p className="bar-error mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="bar-subtitle block mb-1">Email</label>
            <input className="bar-input" placeholder="tucorreo@bar.cl" {...formRegister("email")} />
            {errors.email && <p className="bar-error mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="bar-subtitle block mb-1">Contraseña</label>
            <input type="password" className="bar-input" placeholder="••••••••" {...formRegister("password")} />
            {errors.password && <p className="bar-error mt-1">{errors.password.message}</p>}
          </div>

        {ok && <p className="text-emerald-300">{ok}</p>}
        {err && <p className="bar-error">{err}</p>}

          <button type="submit" disabled={isSubmitting} className="bar-btn bar-btn-primary mt-1">
            {isSubmitting ? "Creando…" : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <span className="bar-subtitle">¿Ya tienes cuenta?</span>
          <Link to="/login" className="bar-link">Iniciar sesión</Link>
        </div>

        <div className="mt-5 bar-sep">o</div>

        <div className="mt-4">
          <Link to="/" className="bar-btn bar-btn-ghost w-full text-center">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
