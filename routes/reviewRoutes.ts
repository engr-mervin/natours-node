import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import { createReview } from '../controllers/reviewController.js';
import { getAllReviews } from '../controllers/reviewController.js';
import { restrict } from '../controllers/authController.js';
import { REVIEW_ACCESS } from '../utils/access-constants.js';

const router = Router();

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrict(REVIEW_ACCESS), createReview);

export default router;
