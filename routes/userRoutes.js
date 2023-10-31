import express from 'express';
import { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMyInfo, deleteMyAccount, } from '../controllers/userController.js';
import { login, passwordForgotten, passwordReset, passwordUpdate, protect, restrict, signup, } from '../controllers/authController.js';
import { ROLE_ADMIN } from '../utils/access-constants.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', passwordForgotten);
router.patch('/resetPassword/:token', passwordReset);
router.patch('/updatePassword', protect, passwordUpdate);
router.patch('/updateMyInfo', protect, updateMyInfo);
router.delete('/deleteMyAccount', protect, deleteMyAccount);
router.route('/').get(getAllUsers).post(createUser);
router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(protect, restrict([ROLE_ADMIN]), deleteUser);
export default router;
