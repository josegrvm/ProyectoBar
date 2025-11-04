import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl p-5 bg-[var(--bar-surface)] border border-[var(--bar-border)]">
        <h2 className="text-lg font-semibold mb-2">Crear mesa</h2>
        <p className="text-[var(--bar-muted)] mb-4">Arranca una nueva mesa y comparte el código con tu grupo.</p>
        <Link to="/mesa" className="inline-block px-4 py-2 rounded-lg bg-[var(--bar-primary)] text-white">Crear</Link>
      </div>
      <div className="rounded-2xl p-5 bg-[var(--bar-surface)] border border-[var(--bar-border)]">
        <h2 className="text-lg font-semibold mb-2">Unirse con QR</h2>
        <p className="text-[var(--bar-muted)] mb-4">Escanea el QR del anfitrión para unirte rápido.</p>
        <Link to="/mesa" className="inline-block px-4 py-2 rounded-lg bg-[var(--bar-secondary)] text-[var(--bar-bg)]">Escanear</Link>
      </div>
      <div className="rounded-2xl p-5 bg-[var(--bar-surface)] border border-[var(--bar-border)]">
        <h2 className="text-lg font-semibold mb-2">Historial</h2>
        <p className="text-[var(--bar-muted)] mb-4">Revisa tus mesas anteriores y exporta comprobantes.</p>
        <Link to="/historial" className="inline-block px-4 py-2 rounded-lg border border-[var(--bar-border)] hover:bg-[var(--bar-nav)]">Ver</Link>
      </div>
    </section>
  );
}
