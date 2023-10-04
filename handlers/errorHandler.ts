import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../classes/customError.js';

const processMongoDBErrors = function (err: Error | CustomError | any) {
  if (err.name === 'CastError') {
    return new CustomError(
      `The value of ${err.value} for ${err.path} is invalid`,
      400
    );
  }

  return new CustomError('');
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
    const error = processMongoDBErrors(err);
    sendErrorProd(error, res);
  }
};
