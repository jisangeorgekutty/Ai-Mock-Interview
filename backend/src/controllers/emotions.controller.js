import Emotions from '../model/emotions.model.js';

export const recordEmotion = async (req, res) => {
  try {
    const emotion = await Emotions.create(req.body);
    res.status(201).json(emotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmotions = async (req, res) => {
  try {
    const data = await Emotions.find({ mockIdRef: req.params.mockIdRef });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
