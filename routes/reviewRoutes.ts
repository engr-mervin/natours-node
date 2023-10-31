import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import {
  createReview,
  deleteReview,
  getReviewById,
} from '../controllers/reviewController.js';
import { getAllReviews } from '../controllers/reviewController.js';
import { restrict } from '../controllers/authController.js';
import {
  DELETE_ACCESS,
  REVIEW_ACCESS,
  ROLE_ADMIN,
} from '../utils/access-constants.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrict(REVIEW_ACCESS), createReview);

router
  .route('/:id')
  .get(protect, getReviewById)
  .delete(protect, restrict(DELETE_ACCESS), deleteReview);

export default router;
