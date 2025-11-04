import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authRequired } from "../utils/authMiddleware.js";

const router = Router();

router.post("/register", async (req,res)=>{
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({error:"Todos los campos son obligatorios."});
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!emailOk) return res.status(400).json({error:"Email inválido."});
  if(password.length < 6) return res.status(400).json({error:"La contraseña debe tener al menos 6 caracteres."});
  const exist = await User.findOne({ email });
  if(exist) return res.status(409).json({error:"Este email ya está registrado."});
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  res.json({ message:"Usuario creado", user:{ id:user._id, name:user.name, email:user.email } });
});

router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({error:"Ingresa email y contraseña."});
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({error:"Usuario o contraseña inválidos."});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({error:"Usuario o contraseña inválidos."});
  const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7*24*60*60*1000 });
  res.json({ message:"Login ok", user:{ id:user._id, name:user.name, email:user.email } });
});

router.post("/logout", (req,res)=>{ res.clearCookie("token"); res.json({ message:"Sesión cerrada" }); });
router.get("/me", authRequired, (req,res)=>{ res.json({ user:{ id:req.user.id, name:req.user.name, email:req.user.email } }); });

export default router;
