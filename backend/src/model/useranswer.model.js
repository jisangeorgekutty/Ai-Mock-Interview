
import mongoose from 'mongoose';

const userAnswerSchema = new mongoose.Schema({
  mockIdRef: { type: String, required: true, ref: 'MockInterview' },
  question: { type: String, required: true },
  correctAns: { type: String, required: true },
  userAns: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: String, required: true }, // again, or Date if appropriate
});

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

export default UserAnswer;