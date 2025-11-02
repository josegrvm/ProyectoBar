import React from 'react';
import api from '../api';

export default function ItemList({ items, participants, onChange }){
  const nameById = Object.fromEntries(participants.map(p=>[p._id, p.name]));

  async function del(id){
    await api.delete(`/items/${id}`);
    onChange?.();
  }

  return (
    <section>
      <h3>Ítems</h3>
      {items.length === 0 && <p>Sin ítems aún</p>}
      <ul>
        {items.map(it => (
          <li key={it._id} style={{ marginBottom: 6 }}>
            <strong>{it.name}</strong> — ${it.unitPrice} × {it.quantity} — comparte: {it.consumers.map(id=>nameById[id]).join(', ')}
            <button style={{ marginLeft: 8 }} onClick={()=>del(it._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
