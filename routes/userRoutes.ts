import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  login,
  passwordForgotten,
  passwordReset,
  passwordUpdate,
  protect,
  signup,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);
router.post('/forgotPassword', passwordForgotten);
router.patch('/resetPassword/:token', passwordReset);

router.patch('/updatePassword', protect, passwordUpdate);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
