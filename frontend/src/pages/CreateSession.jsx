import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateSession(){
  const [title, setTitle] = useState('Viernes en el bar');
  const [tipPercent, setTip] = useState(10);
  const [taxPercent, setTax] = useState(0);
  const nav = useNavigate();

  async function onCreate(e){
    e.preventDefault();
    const { data } = await api.post('/sessions', { title, tipPercent, taxPercent });
    nav(`/s/${data.code}`);
  }

  return (
    <section>
      <h2>Crear mesa</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>Título
          <input value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
        <label>Propina (%)
          <input type="number" value={tipPercent} onChange={e=>setTip(Number(e.target.value))} />
        </label>
        <label>Impuesto (%)
          <input type="number" value={taxPercent} onChange={e=>setTax(Number(e.target.value))} />
        </label>
        <button type="submit">Crear</button>
      </form>
    </section>
  );
}
