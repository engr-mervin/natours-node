import { Router } from 'express';
import { protect, restrict } from '../controllers/authController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';
import { ROLE_ADMIN } from '../utils/access-constants.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../controllers/genericController.js';
import Booking from '../models/bookingModel.js';

const router = Router();

router.use(protect);
router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrict([ROLE_ADMIN]));

router.get('/:bookingId', getOne(Booking));
router.patch('/:bookingId', updateOne(Booking));
router.delete('/:bookingId', deleteOne(Booking));

router.post('/', createOne(Booking));
router.get('/', getAll(Booking));

export default router;
