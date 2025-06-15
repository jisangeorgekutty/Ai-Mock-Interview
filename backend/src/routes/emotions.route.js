import express from 'express';
import { recordEmotion, getEmotions } from '../controllers/emotions.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/record-emotions', protectRoute, recordEmotion);
router.get('/:mockIdRef', protectRoute, getEmotions);

export default router;
