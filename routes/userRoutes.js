import express from 'express';
import { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMyInfo, deleteMyAccount, setID, } from '../controllers/userController.js';
import { login, passwordForgotten, passwordReset, passwordUpdate, protect, restrict, signup, } from '../controllers/authController.js';
import { ROLE_ADMIN } from '../utils/access-constants.js';
import { removeFields } from '../controllers/genericController.js';
const router = express.Router();
//public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', passwordForgotten);
router.patch('/resetPassword/:token', passwordReset);
//protected routes
router.use(protect);
router.patch('/updatePassword', passwordUpdate);
router.patch('/updateMyInfo', updateMyInfo);
router.delete('/deleteMyAccount', deleteMyAccount);
router.get('/', getAllUsers);
router.route('/current').get(setID, getUser);
router
    .route('/:userId')
    .get(getUser)
    .patch(removeFields(['password']), updateUser);
//admin routes
router.use(restrict([ROLE_ADMIN]));
router.post('/', createUser);
router.delete('/', deleteUser);
export default router;
