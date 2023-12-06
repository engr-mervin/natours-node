import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import { filterObject } from '../utils/objectFunctions.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './genericController.js';

// export const getAllUsers = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let users = await User.find();

//     console.log(users);
//     const usersCleaned = JSON.parse(JSON.stringify(users)).map((el: any) => {
//       if (el.passwordChangedAt) delete el.passwordChangedAt;
//       return el;
//     });

//     console.log(usersCleaned);
//     res.status(200).json({
//       status: 'success',
//       results: users.length,
//       data: { usersCleaned },
//     });
//   }
// );

export const updateMyInfo = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body, 'BODY******');
  if (req.body.password || req.body.passwordConfirm) {
    throw new CustomError("You can't change password here", 400);
  }

  const updatedUser: any = await User.findByIdAndUpdate(
    req.user._id,
    filterObject(req.body, 'name', 'email'),
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

export const deleteMyAccount = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //get user from req.user
  const user: any = await User.findById(req.user._id).select(
    '+password +isActive'
  );

  if (!user) {
    throw new CustomError('User not found', 400);
  }
  //ask for log in credentials
  //check password to records
  const passwordIsValid = await user.passwordsMatch(req.body.password);

  if (!passwordIsValid) {
    throw new CustomError('Password does not match our records', 400);
  }

  //set isactive to false
  if (!user.isActive) {
    throw new CustomError('Account already deleted', 400);
  }

  user.isActive = false;
  try {
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    console.error(error);
    throw error;
  }

  res.status(204).json();
});

export const setID = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.params.userId) {
    req.params.userId = req.user._id;
  }

  next();
});

export const getUser = getOne(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const getAllUsers = getAll(User);
