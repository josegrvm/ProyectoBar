export function computeSummary({ items, participants, tipPercent = 0, taxPercent = 0 }) {
  const pidSet = new Set(participants.map(p => String(p._id)));
  const subtotals = new Map([...pidSet].map(pid => [pid, 0]));

  let subtotal = 0;
  for (const it of items) {
    const cost = Number(it.unitPrice) * Number(it.quantity || 1);
    subtotal += cost;
    const consumers = (it.consumers || []).map(String).filter(pid => pidSet.has(pid));
    const k = consumers.length || 1;
    const share = cost / k;
    for (const pid of consumers) {
      subtotals.set(pid, (subtotals.get(pid) || 0) + share);
    }
  }

  const tip = subtotal * (Number(tipPercent) / 100);
  const tax = subtotal * (Number(taxPercent) / 100);
  const total = subtotal + tip + tax;

  const breakdown = participants.map(p => {
    const pid = String(p._id);
    const consume = subtotals.get(pid) || 0;
    const ratio = subtotal > 0 ? consume / subtotal : 0;
    const tipP = tip * ratio;
    const taxP = tax * ratio;
    const totalP = consume + tipP + taxP;
    return { participantId: pid, name: p.name, consume, tip: tipP, tax: taxP, total: totalP };
  });

  return { subtotal, tip, tax, total, breakdown };
}
