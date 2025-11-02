import React from 'react';

export default function Summary({ summary }){
  if(!summary) return null;
  return (
    <section>
      <h3>Resumen</h3>
      <p>
        Subtotal: ${summary.subtotal.toFixed(0)} — Propina: ${summary.tip.toFixed(0)} — Impuesto: ${summary.tax.toFixed(0)} — <strong>Total: ${summary.total.toFixed(0)}</strong>
      </p>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Persona</th>
            <th>Consumo</th>
            <th>Propina</th>
            <th>Impuesto</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {summary.breakdown.map(r => (
            <tr key={r.participantId}>
              <td>{r.name}</td>
              <td>${r.consume.toFixed(0)}</td>
              <td>${r.tip.toFixed(0)}</td>
              <td>${r.tax.toFixed(0)}</td>
              <td><strong>${r.total.toFixed(0)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
