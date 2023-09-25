import express from 'express';
import {
  getTour,
  updateTour,
  deleteTour,
  getAllTours,
  createTour,
} from '../controllers/tourController.js';

const router = express.Router();

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

router.route('/').get(getAllTours).post(createTour);

export default router;
