import EmotionFeedback from '../model/emotionfeedback.model.js';


export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await EmotionFeedback.find({ mockIdRef: req.params.mockIdRef });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveEmotionFeedback = async (req, res) => {
  try {
    const { emotionFeedback, mockIdRef } = req.body;

    const saved = await EmotionFeedback.create({
      mockIdRef,
      emotionFeedback: JSON.stringify(emotionFeedback),
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save emotion feedback" });
  }
};
