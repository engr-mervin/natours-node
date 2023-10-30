import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import {
  createReview,
  getReviewById,
} from '../controllers/reviewController.js';
import { getAllReviews } from '../controllers/reviewController.js';
import { restrict } from '../controllers/authController.js';
import { REVIEW_ACCESS } from '../utils/access-constants.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrict(REVIEW_ACCESS), createReview);

router.route('/:reviewId').get(protect, getReviewById);
export default router;
