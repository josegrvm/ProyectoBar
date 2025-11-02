import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Types.ObjectId, ref: 'Session', index: true },
  name: { type: String, required: true },
  phone: String,
  email: String
}, { timestamps: true });

export default mongoose.model('Participant', ParticipantSchema);
