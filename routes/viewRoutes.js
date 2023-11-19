import { Router } from 'express';
import { renderOverview, renderTours } from '../controllers/viewController.js';
const router = Router();
router.get('/', renderOverview);
router.get('/tour/:tourSlug', renderTours);
export default router;
