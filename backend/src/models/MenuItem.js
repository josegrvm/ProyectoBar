import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const MenuItemSchema = new Schema({
  sessionId: { type: Types.ObjectId, ref: "Session", index: true },
  name: String,
  price: Number,
  category: String,
  source: { type: String, enum: ["barQR","manual"], default: "barQR" }
});
export default mongoose.model("MenuItem", MenuItemSchema);
