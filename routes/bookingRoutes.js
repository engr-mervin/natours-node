import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';
const router = Router();
router.use(protect);
router.get('/checkout-session/:tourId', getCheckoutSession);
export default router;
