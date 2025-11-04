import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const ParticipantSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  displayName: String,
  joinedAt: { type: Date, default: Date.now }
});

const SessionSchema = new Schema({
  title: { type: String, required: true },
  barName: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  hostUserId: { type: Types.ObjectId, ref: "User", required: true },
  participants: [ParticipantSchema],
  taxRate: { type: Number, default: 0.19 },
  tipRate: { type: Number, default: 0.10 },
  currency: { type: String, default: "CLP" },
  status: { type: String, default: "open", enum: ["open","closed"] },
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,
  totalsSnapshot: {
    perUserTotals: [{
      userId: { type: Types.ObjectId, ref: "User" },
      subtotal: Number, tax: Number, tip: Number, service: { type: Number, default: 0 },
      total: Number
    }],
    totalMesa: Number
  }
});

export default mongoose.model("Session", SessionSchema);
