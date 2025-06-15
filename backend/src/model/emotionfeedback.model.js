
import mongoose from 'mongoose';

const emotionFeedbackSchema = new mongoose.Schema({
  mockIdRef: { type: String, required: true, ref: 'MockInterview' },
  emotionFeedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const EmotionFeedback = mongoose.model('EmotionFeedback', emotionFeedbackSchema);
export default EmotionFeedback;