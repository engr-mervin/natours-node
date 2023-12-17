import { Router } from 'express';
import { stripeCheckout } from '../controllers/webhookController.js';
import express from 'express';
const router = Router();
router.post('/checkout', express.raw({ type: 'application/json' }), stripeCheckout);
export default router;
