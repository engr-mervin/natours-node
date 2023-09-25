import express from 'express';
import { getTour, updateTour, deleteTour, getAllTours, createTour, checkID, checkBody, } from '../controllers/tourController.js';
const router = express.Router();
router.param('id', checkID);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(checkBody, createTour);
export default router;
