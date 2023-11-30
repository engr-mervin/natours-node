import { Router } from 'express';
import {
  renderOverview,
  renderTours,
  renderLogin,
  renderFallback,
} from '../controllers/viewController.js';
import {
  isLoggedIn,
  logout,
  protectPage,
} from '../controllers/authController.js';

const router = Router();
router.use(isLoggedIn);
router.get('/login', renderLogin);
router.get('/logout', logout);
router.get('/', renderOverview);

router.use(protectPage);

router.get('/tour/:tourSlug', renderTours);

router.all('*', renderFallback);
export default router;
