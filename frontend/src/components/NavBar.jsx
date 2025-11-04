import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={"px-3 py-2 rounded-lg transition-colors " + (active ? "bg-[var(--bar-primary)] text-white" : "hover:bg-[var(--bar-surface)]")}
    >
      {children}
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--bar-border)] bg-[var(--bar-nav)]/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/home" className="text-xl font-semibold">BarSplit</Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/mesa">Mesa</NavLink>
          <NavLink to="/historial">Historial</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-3 py-2 rounded-lg bg-[var(--bar-secondary)] text-[var(--bar-bg)] hover:opacity-90">Salir</Link>
        </div>
      </div>
    </header>
  );
}
