import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  toggleEventPromotion,
  getEventPromotionStatus,
  getPromotedEvents,
  getPromotionQuota
} from '../controller/eventPromotionController.js';

const router = express.Router();

// Get promoted events (public - for landing page)
router.get('/promoted-events', getPromotedEvents);

// Get promotion quota for organizer
router.get('/promotion-quota', authMiddleware, getPromotionQuota);

// Get promotion status for an event
router.get('/events/:eventId/promotion-status', getEventPromotionStatus);

// Toggle event promotion on/off
router.post('/events/:eventId/toggle-promotion', authMiddleware, toggleEventPromotion);

export default router;
