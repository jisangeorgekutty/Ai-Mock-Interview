import mongoose from 'mongoose';

const emotionsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mockIdRef: { type: String, required: true, ref: 'MockInterview' },
  emotion: { type: String, required: true },
  percentage: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Fix: Avoid OverwriteModelError
const Emotions = mongoose.models.Emotions || mongoose.model('Emotions', emotionsSchema);

export default Emotions;
