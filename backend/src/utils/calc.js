export function computePerUserTotals(orders, taxRate=0, tipRate=0, serviceFee=0){
  const perBase = {};
  for(const o of orders){
    const totalItem = o.unitPrice * o.qty;
    const shares = o.assignedTo.reduce((a,p)=>a+(p.shares||1),0)||1;
    for(const p of o.assignedTo){
      const k=String(p.userId);
      const base=(totalItem*((p.shares||1)/shares));
      perBase[k]=(perBase[k]||0)+base;
    }
  }
  const sumBase = Object.values(perBase).reduce((a,b)=>a+b,0);
  const tax = sumBase*taxRate, tip=sumBase*tipRate;
  const res={};
  for(const [userId, base] of Object.entries(perBase)){
    const w = sumBase? base/sumBase : 0;
    const row = { userId, subtotal: base, tax: tax*w, tip: tip*w, service: serviceFee*w };
    row.total = Math.round((row.subtotal+row.tax+row.tip+row.service)/10)*10;
    res[userId]=row;
  }
  const totalMesa = Object.values(res).reduce((a,x)=>a+x.total,0);
  return { perUserTotals: Object.values(res), totalMesa };
}
