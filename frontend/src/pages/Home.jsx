import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const [code, setCode] = useState('');
  const nav = useNavigate();
  return (
    <section>
      <h2>Entrar a una mesa</h2>
      <form onSubmit={e => { e.preventDefault(); if(code) nav(`/s/${code}`) }}>
        <input placeholder="Código (7 chars)" value={code} onChange={e=>setCode(e.target.value.trim())} />
        <button type="submit">Ir</button>
      </form>
      <p style={{ marginTop: 16 }}>¿Nuevo? Ve a <a href="/create">Crear mesa</a>.</p>
    </section>
  );
}
