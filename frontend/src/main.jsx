import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import "./App.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QRCodeSVG } from "qrcode.react";
import { z } from "zod";
import { useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthProvider, useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import LoginBar from "./pages/LoginBar.jsx";
import RegisterBar from "./pages/RegisterBar.jsx";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function Layout({children}){
  const { user, logout } = useAuth();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">🍻 BarSplit</h2>
        <nav className="flex items-center gap-4 text-blue-200">
          {user && <><Link to="/home" className="hover:underline">Home</Link><Link to="/history" className="hover:underline">Historial</Link></>}
          {!user && <><Link to="/login" className="hover:underline">Login</Link><Link to="/register" className="hover:underline">Registro</Link></>}
          {user && <button onClick={logout} className="btn">Salir</button>}
        </nav>
      </header>
      {children}
      <footer className="mt-8 text-slate-400 text-sm">MERN • Cookies httpOnly • Tailwind • QR • Auth skin</footer>
    </div>
  );
}

function Home(){
  const CreateSchema = z.object({ title: z.string().min(2), barName: z.string().min(2), taxRate: z.coerce.number().min(0), tipRate: z.coerce.number().min(0)});
  const JoinSchema = z.object({ code: z.string().min(4), displayName: z.string().optional() });
  const { register: regC, handleSubmit: hsC, formState:{errors:errC}, reset:resetC } = useRHForm({ resolver: zodResolver(CreateSchema) });
  const { register: regJ, handleSubmit: hsJ, formState:{errors:errJ}, reset:resetJ } = useRHForm({ resolver: zodResolver(JoinSchema) });
  const [createdCode,setCreatedCode]=React.useState("");
  const nav = useNavigate();
  async function onCreate(values){ const r=await axios.post("/sessions", values); setCreatedCode(r.data.session.code); resetC(); }
  async function onJoin(values){ const r=await axios.post(`/sessions/${values.code}/join`, { displayName: values.displayName }); resetJ(); nav(`/session/${r.data.session._id}`); }
  return <Layout>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="text-xl mb-2">Crear mesa</h3>
        <form onSubmit={hsC(onCreate)} className="grid gap-2">
          <input className="input" placeholder="Título" {...regC("title")} />
          {errC.title && <p className="text-red-300 text-sm">{errC.title.message}</p>}
          <input className="input" placeholder="Nombre del bar" {...regC("barName")} />
          {errC.barName && <p className="text-red-300 text-sm">{errC.barName.message}</p>}
          <div className="grid grid-cols-2 gap-2">
            <input className="input" type="number" step="0.01" defaultValue={0.19} {...regC("taxRate")} />
            <input className="input" type="number" step="0.01" defaultValue={0.10} {...regC("tipRate")} />
          </div>
          <button className="btn btn-primary">Crear</button>
        </form>
        {createdCode && <div className="mt-3"><p className="text-slate-400">Código: <span className="badge">{createdCode}</span></p>
          <div className="bg-white p-2 rounded inline-block mt-2"><QRCodeSVG value={`JOIN:${createdCode}`} size={120} /></div></div>}
      </div>
      <div className="card">
        <h3 className="text-xl mb-2">Unirse a mesa</h3>
        <form onSubmit={hsJ(onJoin)} className="grid gap-2">
          <input className="input" placeholder="Código" {...regJ("code")} />
          {errJ.code && <p className="text-red-300 text-sm">{errJ.code.message}</p>}
          <input className="input" placeholder="Tu apodo (opcional)" {...regJ("displayName")} />
          <button className="btn">Unirse</button>
        </form>
        <div className="mt-3"><Link to="/scan/join" className="text-blue-300">📷 Escanear QR para unirse</Link></div>
      </div>
    </div>
  </Layout>;
}

function QRScanner({ mode }){
  const nav = useNavigate();
  React.useEffect(()=>{
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    function onScanSuccess(decodedText){
      scanner.clear();
      if(mode==="join" && decodedText.startsWith("JOIN:")){
        const code = decodedText.split(":")[1];
        axios.post(`/sessions/${code}/join`, { displayName: "Invitado" }).then(r=>nav(`/session/${r.data.session._id}`));
      }else if(mode==="menu" && decodedText.startsWith("BAR:")){
        const sessionId = window.location.pathname.split("/").pop();
        axios.post(`/sessions/${sessionId}/menu/import-from-qr`).then(()=>nav(`/session/${sessionId}`));
      }else{ alert("QR no reconocido"); nav(-1); }
    }
    scanner.render(onScanSuccess, ()=>{});
    return ()=>{ scanner.clear().catch(()=>{}); };
  },[]);
  return <Layout>
    <div className="card"><h3 className="text-xl mb-2">{mode==="join"?"Escanear QR para unirse":"Escanear QR del bar"}</h3>
      <div id="reader" className="mx-auto"></div>
      <p className="text-slate-400 mt-2">Coloca el QR en el recuadro.</p>
    </div>
  </Layout>;
}

function SessionView(){
  const { id } = useParams();
  const [session,setSession]=React.useState(null);
  const [menu,setMenu]=React.useState([]);
  const [orders,setOrders]=React.useState([]);
  const [summary,setSummary]=React.useState(null);
  const [err,setErr]=React.useState("");
  React.useEffect(()=>{ (async()=>{
    try{ const s=await axios.get(`/sessions/${id}`); setSession(s.data.session);
      const m=await axios.get(`/sessions/${id}/menu`); setMenu(m.data.items);
      const o=await axios.get(`/orders/${id}/orders`); setOrders(o.data.orders);
      const sum=await axios.get(`/orders/${id}/summary`); setSummary(sum.data);
    }catch{ setErr("No se pudo cargar la mesa."); }
  })(); },[id]);
  async function closeSession(){ await axios.post(`/sessions/${id}/close`); const s=await axios.get(`/sessions/${id}`); setSession(s.data.session); }
  return <Layout>
    {!session? <p>Cargando...</p>:
      <div className="grid gap-4">
        {err && <p className="text-red-300">{err}</p>}
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">{session.barName} · {session.title} <span className="badge ml-2">{session.status}</span></h3>
            <div className="flex items-center gap-2">
              <Link to={`/scan/menu`} className="btn">📷 Escanear QR del bar</Link>
              <button onClick={closeSession} className="btn btn-primary">Cerrar mesa</button>
            </div>
          </div>
          <p className="text-slate-400 mt-1">Código: <span className="badge">{session.code}</span></p>
          <div className="mt-2"><p className="text-slate-400 mb-1">QR para que se unan:</p>
            <div className="bg-white p-2 rounded inline-block"><QRCodeSVG value={`JOIN:${session.code}`} size={120} /></div></div>
        </div>
        <div className="card"><h4 className="font-semibold">Carta</h4>
          <ul className="list-disc pl-5">{menu.map(it=><li key={it._id}>{it.name} — ${it.price}</li>)}</ul>
        </div>
        <div className="card"><h4 className="font-semibold">Pedidos</h4>
          <div className="overflow-auto"><table className="w-full">
            <thead><tr><th className="text-left">Ítem</th><th>Precio</th><th>Cant</th><th>Asignado a</th></tr></thead>
            <tbody>{orders.map(o=><tr key={o._id}><td>{o.nameSnapshot}</td><td className="text-center">${o.unitPrice}</td><td className="text-center">{o.qty}</td><td>{o.assignedTo.map(a=>a.userId).join(", ")}</td></tr>)}</tbody>
          </table></div>
        </div>
        <div className="card"><h4 className="font-semibold">Resumen</h4>
          {!summary? <p className="text-slate-400">—</p>:
            <div><ul className="list-disc pl-5">{summary.perUserTotals.map(r=><li key={r.userId}>{r.userId}: ${r.total}</li>)}</ul>
            <p className="mt-1">Total mesa: ${summary.totalMesa}</p></div>}
        </div>
      </div>
    }
  </Layout>;
}

function History(){
  const [rows,setRows]=React.useState([]);
  React.useEffect(()=>{ axios.get("/me/sessions").then(r=>setRows(r.data.sessions)); },[]);
  return <Layout>
    <div className="card"><h3 className="text-xl mb-2">Historial de mesas</h3>
      <div className="overflow-auto"><table className="w-full">
        <thead><tr><th>Fecha</th><th>Bar</th><th>Título</th><th>Estado</th><th>Tu consumo</th><th>Pagaste</th><th>Total</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r._id}><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.barName}</td><td><Link to={`/session/${r._id}`} className="text-blue-300">{r.title}</Link></td><td><span className="badge">{r.status}</span></td><td>{r.yourTotal? "$"+r.yourTotal:"—"}</td><td>{r.youPaidToHost? "$"+r.youPaidToHost:"—"}</td><td>{r.totalMesa? "$"+r.totalMesa:"—"}</td></tr>)}</tbody>
      </table></div>
    </div>
  </Layout>;
}

function QRJoinScanner(){ return <PrivateRoute><QRScanner mode="join" /></PrivateRoute>; }
function QRMenuScanner(){ return <PrivateRoute><QRScanner mode="menu" /></PrivateRoute>; }

function App(){
  return (<AuthProvider><BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/register" element={<RegisterBar/>} />
      <Route path="/login" element={<LoginBar/>} />
      <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />
      <Route path="/session/:id" element={<PrivateRoute><SessionView/></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History/></PrivateRoute>} />
      <Route path="/scan/join" element={<QRJoinScanner/>} />
      <Route path="/scan/menu" element={<QRMenuScanner/>} />
    </Routes>
  </BrowserRouter></AuthProvider>);
}

createRoot(document.getElementById("root")).render(<App/>);
