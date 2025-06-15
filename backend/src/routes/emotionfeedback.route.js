import express from 'express';
import { getFeedback, saveEmotionFeedback } from '../controllers/emotionfeedback.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/submit-emotion-feedback', protectRoute, saveEmotionFeedback);
router.get('/fetch-feedback/:mockIdRef', protectRoute, getFeedback);

export default router;
