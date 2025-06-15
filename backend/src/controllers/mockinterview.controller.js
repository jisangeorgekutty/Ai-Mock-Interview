import MockInterview from "../model/mockinterview.model.js";

// Create a new mock interview
export const createMockInterview = async (req, res) => {
  try {
    const {
      jobPosition,
      jobDesc,
      jobExperience,
      jsonMockResp,
      mockId,
    } = req.body;

    const createdBy = req.user?.email; // Assuming `protectRoute` adds user to req

    const newInterview = new MockInterview({
      jobPosition,
      jobDesc,
      jobExperience: Number(jobExperience), // Ensure jobExperience is a number
      jsonMockResp,
      createdBy,
      mockId,
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
    console.error("Create Interview Error:", error);
    res.status(500).json({ message: "Failed to create mock interview" });
  }
};

// Get mock interviews of the logged-in user
export const getMockInterviews = async (req, res) => {
  try {
    const userEmail = req.params;

    const interviews = await MockInterview.find({ createdBy: userEmail }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Fetch Interviews Error:", error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
};

// backend/controllers/mockinterview.controller.js
export const getMockInterviewById = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({
      mockId: req.params.id,
      createdBy: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
