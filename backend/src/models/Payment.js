import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const PaymentSchema = new Schema({
  sessionId: { type: Types.ObjectId, ref: "Session", index: true },
  fromUserId: { type: Types.ObjectId, ref: "User" },
  toUserId: { type: Types.ObjectId, ref: "User" },
  amount: Number,
  method: { type: String, default: "transferencia" },
  paidAt: { type: Date, default: Date.now }
});
export default mongoose.model("Payment", PaymentSchema);
