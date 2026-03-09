import express from 'express';
import { listPromotions, validatePromotion, upsertPromotion, deletePromotion } from '../controller/promotionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Publicly validate a promotion code
router.post('/promotions/validate', validatePromotion);

// Organizer routes (protected)
router.get('/promotions/events/:eventId', authMiddleware, listPromotions);
router.post('/promotions', authMiddleware, upsertPromotion);
router.delete('/promotions/:promotionId', authMiddleware, deletePromotion);

export default router;
