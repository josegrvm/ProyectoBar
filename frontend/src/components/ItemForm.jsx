import React, { useState } from 'react';
import api from '../api';

export default function ItemForm({ sessionId, participants, onCreated }){
  const [name, setName] = useState('Cerveza');
  const [unitPrice, setPrice] = useState(2000);
  const [quantity, setQty] = useState(1);
  const [consumers, setConsumers] = useState([]);

  function toggleConsumer(pid){
    setConsumers(prev => prev.includes(pid) ? prev.filter(x=>x!==pid) : [...prev, pid]);
  }

  async function create(e){
    e.preventDefault();
    if(!name || unitPrice<=0 || quantity<=0 || consumers.length===0) return;
    await api.post(`/items/${sessionId}`, { name, unitPrice, quantity, consumers });
    setName(''); setPrice(0); setQty(1); setConsumers([]);
    onCreated?.();
  }

  return (
    <section>
      <h3>Agregar ítem</h3>
      <form onSubmit={create} style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label>Precio unitario
          <input type="number" value={unitPrice} onChange={e=>setPrice(Number(e.target.value))} />
        </label>
        <label>Cantidad
          <input type="number" value={quantity} onChange={e=>setQty(Number(e.target.value))} />
        </label>
        <fieldset>
          <legend>¿Quiénes lo consumieron?</legend>
          {participants.map(p => (
            <label key={p._id} style={{ marginRight: 12 }}>
              <input type="checkbox" checked={consumers.includes(p._id)} onChange={()=>toggleConsumer(p._id)} /> {p.name}
            </label>
          ))}
        </fieldset>
        <button type="submit">Agregar ítem</button>
      </form>
    </section>
  );
}
