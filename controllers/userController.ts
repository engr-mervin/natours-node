import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { catchAsync } from '../utils/routerFunctions.js';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res
      .status(200)
      .json({ status: 'success', results: users.length, data: { users } });
  }
);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const getUser = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({ status: 'err', message: 'This route is not yet defined!' });
};
export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({ status: 'err', message: 'This route is not yet defined!' });
};
