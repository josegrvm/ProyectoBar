import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../AuthContext";
import MotionCard from "../components/motion/MotionCard";
import MotionButton from "../components/motion/MotionButton";
import { api } from "../api/axios";
import "../App.css";

const Schema = z.object({
    barName: z.string().min(2, "Ingresa el nombre del bar"),
    title: z.string().min(2, "Ingresa un título"),
    tipPercent: z.coerce.number().min(0).max(100).default(10),
    peopleCount: z.coerce.number().min(1, "Debe ser al menos 1")
    });

    export default function CrearMesa(){
    const nav = useNavigate();
    const { user } = useAuth();

    const { register, handleSubmit, formState:{ errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(Schema),
        defaultValues: { barName: "ClubGordos", title: "Cumple Jose", tipPercent: 10, peopleCount: 2 }
    });

const onSubmit = async (values) => {
    try {
        // POST real al backend
        const { data } = await api.post("/mesas", values);
        // Opcional: navegar a /mesa/:id (si quieres ver esa mesa en detalle)
        // nav(`/mesa/${data.id}`);
        nav("/mesa");
    } catch (e) {
        console.error(e);
        alert(e?.response?.data?.error || "No se pudo crear la mesa");
    }
};

    return (
        <div className="bar-bg min-h-screen flex items-start justify-center px-4 py-8">
        <MotionCard className="w-full max-w-md p-6">
            <h1 className="bar-title text-2xl font-semibold mb-1">
            Bienvenido, {user?.name ?? "invitado"} ✨
            </h1>
            <p className="bar-subtitle mb-5">Configura tu mesa y comencemos.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div>
                <label className="bar-subtitle block mb-1">Nombre del bar</label>
                <input className="bar-input" placeholder="Ej: ClubGordos" {...register("barName")} />
                {errors.barName && <p className="bar-error mt-1">{errors.barName.message}</p>}
            </div>

            <div>
                <label className="bar-subtitle block mb-1">Título</label>
                <input className="bar-input" placeholder="Ej: Cumple Jose" {...register("title")} />
                {errors.title && <p className="bar-error mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="bar-subtitle block mb-1">Escanear carta del bar (opcional)</label>
                <input className="bar-input" type="file" accept="image/*,.pdf" />
                <p className="bar-subtitle mt-1" style={{fontSize:12, opacity:.8}}>
                Más adelante conectamos el lector QR real.
                </p>
            </div>

            <div>
                <label className="bar-subtitle block mb-1">% Propina</label>
                <input className="bar-input" type="number" min={0} max={100} {...register("tipPercent")} />
                {errors.tipPercent && <p className="bar-error mt-1">{errors.tipPercent.message}</p>}
            </div>

            <div>
                <label className="bar-subtitle block mb-1">Cantidad de personas</label>
                <input className="bar-input" type="number" min={1} {...register("peopleCount")} />
                {errors.peopleCount && <p className="bar-error mt-1">{errors.peopleCount.message}</p>}
            </div>

            <MotionButton type="submit" disabled={isSubmitting} className="bar-btn-primary mt-2">
                {isSubmitting ? "Creando…" : "Crear mesa"}
            </MotionButton>
            </form>
        </MotionCard>
        </div>
    );
}
