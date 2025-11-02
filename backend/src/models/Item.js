import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Types.ObjectId, ref: 'Session', index: true },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  consumers: [{ type: mongoose.Types.ObjectId, ref: 'Participant' }]
}, { timestamps: true });

export default mongoose.model('Item', ItemSchema);
