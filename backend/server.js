import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI no está definida en .env");
  process.exit(1);
}
if (!JWT_SECRET) {
  console.warn("⚠️ Falta JWT_SECRET en .env");
}

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

try {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Conectado a MongoDB Atlas");
} catch (e) {
  console.error("❌ Error conectando a Atlas:", e.message);
  process.exit(1);
}

// ...tus rutas...

app.listen(PORT, () => console.log(`🚀 API http://localhost:${PORT}`));
