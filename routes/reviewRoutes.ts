import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import {
  createReview,
  deleteReview,
  getReview,
  restrictToOwner,
  setIDs,
  setTour,
  updateReview,
} from '../controllers/reviewController.js';
import { getAllReviews } from '../controllers/reviewController.js';
import { restrict } from '../controllers/authController.js';
import { DELETE_ACCESS, ROLE_USER } from '../utils/access-constants.js';
import { allowFields } from '../controllers/genericController.js';

const router = Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(setTour, getAllReviews)
  .post(
    restrict([ROLE_USER]),
    allowFields(['rating', 'review', 'tour']),
    setIDs,
    createReview
  );

router
  .route('/:reviewId')
  .get(getReview)
  .patch(
    restrictToOwner,
    allowFields(['rating', 'review']),
    setIDs,
    updateReview
  )
  .delete(restrict(DELETE_ACCESS), restrictToOwner, deleteReview);

export default router;
