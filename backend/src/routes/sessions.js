import { Router } from "express";
import { customAlphabet } from "nanoid";
import Session from "../models/Session.js";
import MenuItem from "../models/MenuItem.js";
import { authRequired } from "../utils/authMiddleware.js";

const nano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
const router = Router();

router.post("/", authRequired, async (req,res)=>{
  const { title, barName, taxRate=0.19, tipRate=0.10, currency="CLP" } = req.body;
  if(!title || !barName) return res.status(400).json({error:"Faltan campos"});
  const code = nano();
  const session = await Session.create({
    title, barName, code, hostUserId: req.user.id, taxRate, tipRate, currency,
    participants: [{ userId: req.user.id, displayName: req.user.email?.split("@")[0] || "Host" }]
  });
  res.json({ session });
});

router.post("/:code/join", authRequired, async (req,res)=>{
  const { code } = req.params;
  const { displayName } = req.body;
  const session = await Session.findOne({ code, status: "open" });
  if(!session) return res.status(404).json({error:"Mesa no encontrada o cerrada"});
  const exists = session.participants.find(p=> String(p.userId)===String(req.user.id));
  if(!exists){
    session.participants.push({ userId: req.user.id, displayName: displayName || "Invitado" });
    await session.save();
  }
  res.json({ session });
});

router.get("/:id", authRequired, async (req,res)=>{
  const session = await Session.findById(req.params.id);
  if(!session) return res.status(404).json({error:"No encontrada"});
  res.json({ session });
});

router.post("/:id/menu/import-from-qr", authRequired, async (req,res)=>{
  const { id } = req.params;
  const session = await Session.findById(id);
  if(!session) return res.status(404).json({error:"No encontrada"});
  const seed = [
    { name:"Jarra IPA", price:12000, category:"Bebidas" },
    { name:"Papas fritas", price:8000, category:"Comida" },
    { name:"Negroni", price:7000, category:"Cocktails" }
  ];
  const docs = await MenuItem.insertMany(seed.map(s=>({ ...s, sessionId: session._id, source:"barQR" })));
  res.json({ items: docs });
});

router.get("/:id/menu", authRequired, async (req,res)=>{
  const items = await MenuItem.find({ sessionId: req.params.id });
  res.json({ items });
});

router.post("/:id/close", authRequired, async (req,res)=>{
  const session = await Session.findById(req.params.id);
  if(!session) return res.status(404).json({error:"No encontrada"});
  session.status = "closed";
  session.closedAt = new Date();
  await session.save();
  res.json({ session });
});

export default router;
