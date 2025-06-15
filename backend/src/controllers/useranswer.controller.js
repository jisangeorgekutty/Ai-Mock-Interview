import UserAnswer from '../model/useranswer.model.js';

export const submitAnswer = async (req, res) => {
  try {
    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
      createdAt,
    } = req.body;

    // Check if an answer already exists
    const existingAnswer = await UserAnswer.findOne({
      mockIdRef,
      question,
      userEmail,
    });

    if (existingAnswer) {
      // Update the existing answer
      existingAnswer.userAns = userAns;
      existingAnswer.feedback = feedback;
      existingAnswer.rating = rating;
      existingAnswer.createdAt = createdAt;

      await existingAnswer.save();
      return res.status(200).json({ message: "Answer updated", answer: existingAnswer });
    }

    // Create new answer if not exists
    const newAnswer = new UserAnswer({
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
      createdAt,
    });

    await newAnswer.save();
    return res.status(201).json({ message: "Answer submitted", answer: newAnswer });
  } catch (err) {
    console.error("Submit Answer Error:", err);
    res.status(500).json({ message: "Failed to submit answer" });
  }
};

export const getAnswersByEmailAndMock = async (req, res) => {
  const { email, mockId } = req.params;

  try {
    const answers = await UserAnswer.find({
      userEmail: email,
      mockIdRef: mockId
    });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


