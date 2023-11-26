import { Router } from 'express';
import {
  renderOverview,
  renderTours,
  renderLogin,
} from '../controllers/viewController.js';
import { isLoggedIn, protectPage } from '../controllers/authController.js';

const router = Router();
router.use(isLoggedIn);
router.get('/login', renderLogin);
router.get('/', renderOverview);

router.use(protectPage);

router.get('/tour/:tourSlug', renderTours);

export default router;
