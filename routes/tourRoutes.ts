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
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.route('/top5').get(aliasTop, getAllTours);

router.route('/monthly/:year').get(getMonthlyPlan);

router.route('/stats').get(getTourStats);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

router.route('/').get(protect, getAllTours).post(createTour);

export default router;
