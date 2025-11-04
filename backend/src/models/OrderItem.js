import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const OrderItemSchema = new Schema({
  sessionId: { type: Types.ObjectId, ref: "Session", index: true },
  nameSnapshot: String,
  unitPrice: Number,
  qty: Number,
  assignedTo: [{
    userId: { type: Types.ObjectId, ref: "User" },
    shares: { type: Number, default: 1 }
  }],
  createdBy: { type: Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("OrderItem", OrderItemSchema);
