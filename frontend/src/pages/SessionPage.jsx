import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Participants from '../components/Participants.jsx';
import ItemForm from '../components/ItemForm.jsx';
import ItemList from '../components/ItemList.jsx';
import Summary from '../components/Summary.jsx';

export default function SessionPage(){
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);

  async function load(){
    const { data } = await api.get(`/sessions/code/${code}`);
    setData(data);
  }

  async function refreshSummary(sessionId){
    const { data } = await api.get(`/sessions/${sessionId}/summary`);
    setSummary(data);
  }

  useEffect(()=>{ load(); }, [code]);
  useEffect(()=>{ if(data?.session?._id) refreshSummary(data.session._id); }, [data]);

  const shareUrl = useMemo(()=> window.location.href, [code]);

  if(!data) return <p>Cargando...</p>;
  const { session, participants, items } = data;

  return (
    <section>
      <h2>{session.title} — Código: {session.code}</h2>
      <p>
        Propina: {session.tipPercent}% | Impuesto: {session.taxPercent}% | Moneda: {session.currency}
      </p>
      <p>
        Comparte este link: <a href={shareUrl}>{shareUrl}</a>
      </p>

      <hr />

      <Participants sessionId={session._id} participants={participants} onChange={load} />

      <ItemForm sessionId={session._id} participants={participants} onCreated={load} />

      <ItemList items={items} participants={participants} onChange={load} />

      <Summary summary={summary} />
    </section>
  );
}
