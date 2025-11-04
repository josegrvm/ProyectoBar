import { Router } from "express";
import { authRequired } from "../utils/authMiddleware.js";
import Session from "../models/Session.js";
import Payment from "../models/Payment.js";

const router = Router();

router.get("/sessions", authRequired, async (req,res)=>{
  const sessions = await Session.find({ "participants.userId": req.user.id }).sort({ createdAt: -1 });
  const result = [];
  for(const s of sessions){
    let yourTotal = null;
    if(s.totalsSnapshot && Array.isArray(s.totalsSnapshot.perUserTotals)){
      const row = s.totalsSnapshot.perUserTotals.find(r => String(r.userId) === String(req.user.id));
      yourTotal = row ? row.total : null;
    }
    const pays = await Payment.find({ sessionId: s._id, fromUserId: req.user.id });
    const paidSum = pays.reduce((a,p)=>a+p.amount,0);
    result.push({
      _id: s._id, title: s.title, barName: s.barName, status: s.status,
      createdAt: s.createdAt, closedAt: s.closedAt, totalMesa: s.totalsSnapshot?.totalMesa ?? null,
      yourTotal, youPaidToHost: paidSum
    });
  }
  res.json({ sessions: result });
});

export default router;
