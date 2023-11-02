import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import { createReview, deleteReview, getReview, restrictToOwner, setIDs, updateReview, } from '../controllers/reviewController.js';
import { getAllReviews } from '../controllers/reviewController.js';
import { restrict } from '../controllers/authController.js';
import { CAN_POST_REVIEWS, DELETE_ACCESS, } from '../utils/access-constants.js';
import { allowFields } from '../controllers/genericController.js';
const router = Router({ mergeParams: true });
router
    .route('/')
    .get(protect, getAllReviews)
    .post(protect, restrict(CAN_POST_REVIEWS), allowFields(['rating', 'review', 'tour']), setIDs, createReview);
router
    .route('/:id')
    .get(protect, getReview)
    .patch(protect, restrictToOwner, allowFields(['rating', 'review']), setIDs, updateReview)
    .delete(protect, restrict(DELETE_ACCESS), deleteReview);
export default router;
