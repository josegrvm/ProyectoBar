import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";

export default function Mesa(){
  const { id } = useParams(); // puede ser undefined si vas a /mesa simple
  const [mesa, setMesa] = React.useState(null);

  React.useEffect(() => {
    if (!id) return;
    api.get(`/mesas/${id}`)
      .then(res => setMesa(res.data.mesa))
      .catch(() => setMesa(null));
  }, [id]);

  return (
    <section className="rounded-2xl p-5 bg-[var(--bar-surface)] border border-[var(--bar-border)]">
      <h1 className="text-2xl font-semibold mb-2">Mesa en vivo</h1>
      {id && <p className="bar-subtitle mb-4">ID: {id}</p>}
      {mesa ? (
        <div className="bar-subtitle">
          <div><b>Bar:</b> {mesa.barName}</div>
          <div><b>Título:</b> {mesa.title}</div>
          <div><b>Propina:</b> {mesa.tipPercent}%</div>
          <div><b>Personas:</b> {mesa.peopleCount}</div>
        </div>
      ) : (
        <p className="bar-subtitle">Configuremos la mesa…</p>
      )}
    </section>
  );
}
