import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  code: { type: String, index: true, unique: true },
  title: { type: String, default: 'Mesa' },
  tipPercent: { type: Number, default: 10 },
  taxPercent: { type: Number, default: 0 },
  currency: { type: String, default: 'CLP' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Session', SessionSchema);
