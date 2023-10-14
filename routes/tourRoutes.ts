import express from 'express';
import {
  getTour,
  updateTour,
  deleteTour,
  getAllTours,
  createTour,
  aliasTop,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { protect, restrict } from '../controllers/authController.js';
import { DELETE_ACCESS } from '../utils/access-constants.js';

const router = express.Router();

router.route('/top5').get(aliasTop, getAllTours);

router.route('/monthly/:year').get(getMonthlyPlan);

router.route('/stats').get(getTourStats);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrict(DELETE_ACCESS), deleteTour);

router.route('/').get(protect, getAllTours).post(createTour);

export default router;
