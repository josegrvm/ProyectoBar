import React from "react";

export default function Mesa() {
  return (
    <section className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mesa en vivo</h1>
          <p className="text-[var(--bar-muted)]">Bar — Código: <span className="font-mono">XXXX-YY</span></p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-[var(--bar-primary)] text-white">Agregar pedido</button>
          <button className="px-3 py-2 rounded-lg border border-[var(--bar-border)]">Cerrar mesa</button>
        </div>
      </header>
      <div className="rounded-2xl p-5 bg-[var(--bar-surface)] border border-[var(--bar-border)]">
        <p className="text-[var(--bar-muted)]">Aquí se listarán los pedidos (por persona / categoría) y totales parciales.</p>
      </div>
    </section>
  );
}
