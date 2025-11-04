import { Router } from "express";
import OrderItem from "../models/OrderItem.js";
import Session from "../models/Session.js";
import { authRequired } from "../utils/authMiddleware.js";
import { computePerUserTotals } from "../utils/calc.js";

const router = Router();

router.post("/:id/orders", authRequired, async (req,res)=>{
  const { id } = req.params;
  const { name, unitPrice, qty=1, assignedTo=[] } = req.body;
  if(!name || !unitPrice) return res.status(400).json({error:"Campos requeridos"});
  const order = await OrderItem.create({ sessionId: id, nameSnapshot: name, unitPrice, qty, assignedTo, createdBy: req.user.id });
  res.json({ order });
});

router.get("/:id/orders", authRequired, async (req,res)=>{
  const orders = await OrderItem.find({ sessionId: req.params.id });
  res.json({ orders });
});

router.get("/:id/summary", authRequired, async (req,res)=>{
  const session = await Session.findById(req.params.id);
  if(!session) return res.status(404).json({error:"No encontrada"});
  const orders = await OrderItem.find({ sessionId: session._id });
  const { perUserTotals, totalMesa } = computePerUserTotals(orders, session.taxRate, session.tipRate, 0);
  res.json({ perUserTotals, totalMesa });
});

router.delete("/:orderId", authRequired, async (req,res)=>{
  await OrderItem.deleteOne({ _id: req.params.orderId });
  res.json({ ok:true });
});

export default router;
