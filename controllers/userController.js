import User from '../models/userModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res
        .status(200)
        .json({ status: 'success', results: users.length, data: { users } });
});
export const createUser = (req, res, next) => {
    res
        .status(500)
        .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const getUser = (req, res, next) => {
    res
        .status(500)
        .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const updateUser = (req, res, next) => {
    res
        .status(500)
        .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const deleteUser = (req, res, next) => {
    res
        .status(500)
        .json({ status: 'err', message: 'This route is not yet defined!' });
};
