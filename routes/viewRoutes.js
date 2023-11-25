import { Router } from 'express';
import { renderOverview, renderTours, renderLogin } from '../controllers/viewController.js';
const router = Router();
router.get('/', renderOverview);
router.get('/tour/:tourSlug', renderTours);
router.get('/login', renderLogin);
export default router;
