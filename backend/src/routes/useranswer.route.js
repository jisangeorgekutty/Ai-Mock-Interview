import express from 'express';
import { submitAnswer, getAnswersByEmailAndMock } from '../controllers/useranswer.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/user-answer', protectRoute, submitAnswer);
router.get('/:email/:mockId', protectRoute, getAnswersByEmailAndMock);



export default router;
