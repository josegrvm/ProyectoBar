import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--bar-border)] bg-[var(--bar-surface)]">
      <div className="container mx-auto px-4 py-6 text-sm text-[var(--bar-muted)]">
        © {new Date().getFullYear()} BarSplit — hecho con 🍻 y código limpio.
      </div>
    </footer>
  );
}
