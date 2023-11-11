import express from 'express';
import { getTour, updateTour, deleteTour, getAllTours, createTour, aliasTop, getTourStats, getMonthlyPlan, } from '../controllers/tourController.js';
import { protect, restrict } from '../controllers/authController.js';
import { DELETE_ACCESS, ROLE_ADMIN, ROLE_GUIDE, ROLE_LEAD_GUIDE, } from '../utils/access-constants.js';
import reviewRouter from './reviewRoutes.js';
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router.route('/top5').get(aliasTop, getAllTours);
router
    .route('/monthly/:year')
    .get(protect, restrict([ROLE_ADMIN, ROLE_LEAD_GUIDE, ROLE_GUIDE]), getMonthlyPlan);
router.route('/stats').get(getTourStats);
router
    .route('/:tourId')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrict(DELETE_ACCESS), deleteTour);
router
    .route('/')
    .get(getAllTours)
    .post(protect, restrict([ROLE_ADMIN, ROLE_LEAD_GUIDE]), createTour);
export default router;
