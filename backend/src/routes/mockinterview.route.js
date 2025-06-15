import express from 'express';
import { createMockInterview, getMockInterviews, getMockInterviewById } from '../controllers/mockinterview.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/mock-interview', protectRoute, createMockInterview);
router.get('/fetchinterview/:email', protectRoute, getMockInterviews);
router.get("/get-mock-interview/:id", protectRoute, getMockInterviewById);

export default router;
