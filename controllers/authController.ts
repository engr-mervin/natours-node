import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel.js';
import { catchAsync, catchAsyncPage } from '../utils/routerFunctions.js';
import jwt from 'jsonwebtoken';
import { CustomError } from '../classes/customError.js';
import { validator } from '../utils/validators.js';
import { EMAIL_REGEX } from '../utils/constants.js';
import { Emailer } from '../utils/email.js';
import crypto from 'crypto';

const signToken = function (id: any) {
  return jwt.sign({ id }, process.env.JSONWEBTOKEN_SECRET!, {
    expiresIn: process.env.JSONWEBTOKEN_EXPIRY!,
  });
};

const createSendToken = function (
  user: any,
  statusCode: number,
  res: Response
) {
  const token = signToken(user._id);

  const expiry: number = Number(process.env.JWT_COOKIE_EXPIRY) || 90;

  const cookieOptions = {
    expires: new Date(Date.now() + expiry * 86400 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
export const signup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const url = `${req.protocol}://${req.get('host')}/me/`;

  const emailer = new Emailer(newUser, url);
  await emailer.sendWelcome();

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  //check the validity of email and passowrd

  if (!email || !password) {
    throw new CustomError('Please provide email and password!', 400);
  }

  //validate the email
  if (!validator(EMAIL_REGEX)(email)) {
    throw new CustomError('Email is invalid!', 400);
  }

  //get the hash of email from server
  const user: any = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomError('User does not exist!', 400);
  }

  //hash the password and compare

  const matched = await user.passwordsMatch(password);

  if (!matched) {
    throw new CustomError('The password does not match with our records.', 401);
  }

  //if it exists send a JWT

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //check request if it contains a JWT

  let token: any;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new CustomError('Invalid user credentials.', 401);
  }

  //verify the JWT

  const payload: any = jwt.verify(
    token,
    process.env.JSONWEBTOKEN_SECRET!,
    (error: any, payload: any) => {
      if (error) throw error;

      return payload;
    }
  );

  //if verified get the user

  const candidateUser: any = await User.findById(payload.id);
  if (candidateUser === undefined || candidateUser === null) {
    throw new CustomError('User does not exist.', 401);
  }
  const isModified = await candidateUser.passwordModifiedAfter(payload.iat);

  if (isModified) {
    throw new CustomError(
      'Token is no longer valid. Please log in again.',
      401
    );
  }

  req.user = candidateUser;

  next();
});

export const protectPage = catchAsyncPage(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //check request if it contains a JWT
  if (!req?.cookies?.jwt) {
    throw new CustomError('Please provide a valid auth token', 401);
  }

  const token = req.cookies.jwt as string;

  //verify the JWT
  const payload: any = jwt.verify(
    token,
    process.env.JSONWEBTOKEN_SECRET!,
    (error, payload) => {
      if (error) throw error;

      return payload;
    }
  );

  //if verified get the user

  const candidateUser: any = await User.findById(payload.id);
  if (candidateUser === undefined || candidateUser === null) {
    throw new CustomError('User does not exist.', 401);
  }
  const isModified = await candidateUser.passwordModifiedAfter(payload.iat);

  if (isModified) {
    throw new CustomError(
      'Token is no longer valid. Please log in again.',
      401
    );
  }

  res.locals.user = candidateUser;

  req.user = candidateUser;
  next();
});

export const logout = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.clearCookie('jwt');

  res.redirect('/');
});

export const isLoggedIn = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //check request if it contains a JWT
    if (!req?.cookies?.jwt) {
      return next();
    }

    const token = req.cookies.jwt as string;

    //verify the JWT
    const payload: any = jwt.verify(
      token,
      process.env.JSONWEBTOKEN_SECRET!,
      (error, payload) => {
        if (error) throw error;

        return payload;
      }
    );

    //if verified get the user

    const candidateUser: any = await User.findById(payload.id);
    if (candidateUser === undefined || candidateUser === null) {
      return next();
    }
    const isModified = await candidateUser.passwordModifiedAfter(payload.iat);

    if (isModified) {
      return next();
    }

    res.locals.user = candidateUser;
    next();
  } catch (error: any) {
    next();
  }
};

export const restrict = function (authorizedRoles: string[]) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!authorizedRoles.includes(req.user.role)) {
      throw new CustomError(
        'You are unauthorized to perform this action.',
        403
      );
    }

    next();
  });
};

export const passwordForgotten = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Get user
  const user: any = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new CustomError('User is not registered', 404);
  }
  //Generate email token

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to users email
  const resetURL = `/api/v1/users/resetPassword/${resetToken}`;

  const emailer = new Emailer(user, resetURL);

  try {
    await emailer.sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(
      'There was an error sending the reset password email, try again later!',
      500
    );
  }
});

export const passwordReset = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Get token
  const resetToken = req.params.token;
  if (!resetToken) {
    throw new CustomError('Invalid reset password request.');
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Get user based on token

  const user = await User.findOne({ passwordResetToken: hashedToken });

  if (!user) {
    throw new CustomError('Invalid password reset request token');
  }

  try {
    //Check if token expiry is valid
    if (!user.passwordResetExpires) {
      throw new CustomError(
        'Something went wrong with token generation, please try again later.'
      );
    }

    //Check if token has expired
    const hasExpired = Date.now() > user.passwordResetExpires.getTime();

    if (hasExpired) {
      throw new CustomError(
        'This request has already expired. Please try again.'
      );
    }
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    throw error;
  }

  //set the new password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const jsonWebToken = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token: jsonWebToken,
  });
});

export const passwordUpdate = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //then check if the user.password = req.body.password
  const user: any = await User.findOne({ _id: req.user._id }).select(
    '+password'
  );
  if (!user) {
    throw new CustomError('User not found', 400);
  }
  const passwordValid = await user.passwordsMatch(req.body.currentPassword);

  if (!passwordValid) {
    throw new CustomError('Invalid current password.', 400);
  }
  //if it is correct
  //update the password of the user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
