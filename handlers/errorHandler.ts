import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../classes/customError.js';

const processMongoDBErrors = function (err: Error | CustomError | any) {
  if (err.name === 'CastError') {
    return new CustomError(
      `The value of ${err.value} for ${err.path} is invalid`,
      400
    );
  }
  if (err.code === 11000) {
    const entries = Object.entries(err.keyValue);
    return new CustomError(
      `The value of: ${entries[0][1]} for field:${entries[0][0]} already exists.`,
      400
    );
  }

  if (err.name === 'ValidationError') {
    const errorMessages = Object.values(err.errors)
      .map((el: any) => el.message)
      .join('. ');
    return new CustomError(err, 400);
  }

  return err;
};

const processJWTErrors = function (err: Error | CustomError) {
  if (err.name === 'JsonWebTokenError') {
    return new CustomError('Invalid web token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return new CustomError('Web token already expired', 401);
  }

  return new CustomError('Something went wrong', 500);
};

const sendErrorDev = function (err: CustomError, res: Response) {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = function (err: CustomError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = processMongoDBErrors(err);
    error = processJWTErrors(error);
    sendErrorProd(error, res);
  }
};
