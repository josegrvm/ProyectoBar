import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateSession from './pages/CreateSession.jsx';
import SessionPage from './pages/SessionPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App(){
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}><Link to="/">BarSplit</Link></h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/create">Crear mesa</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/s/:code" element={<SessionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
