import { Request, Response, NextFunction } from 'express';

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(500)
    .json({ status: 'err', message: 'This route is not yet defined!' });
};
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
