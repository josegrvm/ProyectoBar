import { Router } from "express";
import Payment from "../models/Payment.js";
import Session from "../models/Session.js";
import { authRequired } from "../utils/authMiddleware.js";

const router = Router();

router.post("/:id/payments", authRequired, async (req,res)=>{
  const { id } = req.params;
  const { amount, method="transferencia" } = req.body;
  const session = await Session.findById(id);
  if(!session) return res.status(404).json({error:"No encontrada"});
  const payment = await Payment.create({ sessionId: id, fromUserId: req.user.id, toUserId: session.hostUserId, amount, method });
  res.json({ payment });
});

router.get("/:id/payments", authRequired, async (req,res)=>{
  const list = await Payment.find({ sessionId: req.params.id });
  res.json({ payments: list });
});

export default router;
