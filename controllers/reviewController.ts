import { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import Tour from '../models/tourModel.js';

export const getAllReviews = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reviews = req.params.id
    ? await Review.find({ tour: req.params.id })
    : await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const getReviewById = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const review = await Review.findById(req.params.reviewId);

  if (!review) throw new CustomError('Review not found', 404);
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

export const createReview = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //validate ID??

  console.log(req.params);

  const tour = await Tour.findById(req.params.id);

  if (!tour) throw new CustomError('Tour not found', 400);

  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.params.id,
    user: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
