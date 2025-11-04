import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.js";
import sessionRoutes from "./src/routes/sessions.js";
import orderRoutes from "./src/routes/orders.js";
import paymentRoutes from "./src/routes/payments.js";
import meRoutes from "./src/routes/me.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, { dbName: "barsplit" })
  .then(()=>console.log("MongoDB connected"))
  .catch((e)=>console.error("MongoDB error", e.message));

app.get("/", (req,res)=>res.json({ok:true}));

app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/me", meRoutes);

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).json({error:"Internal Server Error"});
});

app.listen(PORT, ()=>console.log(`API on http://localhost:${PORT}`));
