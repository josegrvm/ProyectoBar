import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authRequired } from "../utils/authMiddleware.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: "Campos obligatorios" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email ya registrado" });
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash });
  res.status(201).json({ message: "ok" });
});

// LOGIN (cookie httpOnly)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ error: "Credenciales inválidas" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",   // en prod con dominios distintos: 'none' + secure:true
    secure: false,     // en prod (https) -> true
    maxAge: 7*24*60*60*1000
  });

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada" });
});

// ME (PROTEGIDA)
router.get("/me", authRequired, (req, res) => {
  const { id, name, email } = req.user;
  res.json({ user: { id, name, email } });
});

export default router;
