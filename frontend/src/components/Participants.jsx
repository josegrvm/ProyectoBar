import React, { useState } from 'react';
import api from '../api';

export default function Participants({ sessionId, participants, onChange }){
  const [name, setName] = useState('');

  async function add(e){
    e.preventDefault();
    if(!name.trim()) return;
    await api.post(`/participants/${sessionId}`, { name });
    setName('');
    onChange?.();
  }

  async function del(id){
    await api.delete(`/participants/${id}`);
    onChange?.();
  }

  return (
    <section>
      <h3>Participantes</h3>
      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {participants.map(p => (
          <li key={p._id}>
            {p.name} <button onClick={()=>del(p._id)}>x</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
