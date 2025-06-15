import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema({
  jsonMockResp: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  jobDesc: {
    type: String,
    required: true,
  },
  jobExperience: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  mockId: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true
});

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);
export default MockInterview;
