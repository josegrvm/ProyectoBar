
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";

const RegisterSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterBar(){
  const { register, handleSubmit, formState:{ errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(RegisterSchema) });
  const [ok,setOk] = React.useState("");
  const [err,setErr] = React.useState("");

  async function onSubmit(values){
    setOk(""); setErr("");
    try{
      await axios.post("/auth/register", values, { withCredentials:true });
      setOk("Cuenta creada ✅ Ahora puedes iniciar sesión.");
      reset({ name:"", email:"", password:"" });
    }catch(ex){
      setErr(ex?.response?.data?.error || "No se pudo crear la cuenta");
    }
  }

  return (
    <div className="bar-bg flex items-center justify-center p-6">
      <div className="bar-card w-full max-w-md p-6">
        <div className="mb-5">
          <h1 className="bar-title text-2xl font-semibold">🍹 Únete a BarSplit</h1>
          <p className="bar-subtitle">Crea tu cuenta para dividir la cuenta con tus amigos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div>
            <label className="bar-subtitle block mb-1">Nombre</label>
            <input className="bar-input" placeholder="Tu nombre" {...register("name")} />
            {errors.name && <p className="bar-error mt-1">{errors.name.message}</p>}
          </div>
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

          {ok && <p className="text-emerald-300">{ok}</p>}
          {err && <p className="bar-error">{err}</p>}

          <button disabled={isSubmitting} className="bar-btn bar-btn-primary mt-1">
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
