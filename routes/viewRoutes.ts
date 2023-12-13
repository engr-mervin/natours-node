import { Router } from 'express';
import {
  renderOverview,
  renderTours,
  renderLogin,
  renderFallback,
  renderAccount,
  renderMyTours,
} from '../controllers/viewController.js';
import {
  isLoggedIn,
  logout,
  protectPage,
} from '../controllers/authController.js';
import { createBookingCheckout } from '../controllers/bookingController.js';

const router = Router();
router.use(isLoggedIn);
router.get('/login', renderLogin);
router.get('/logout', logout);
router.get('/', createBookingCheckout, renderOverview);

router.get('/tour/:tourSlug', protectPage, renderTours);
router.get('/me', protectPage, renderAccount);
router.get('/my-tours', protectPage, renderMyTours);

router.all('*', renderFallback);
export default router;
