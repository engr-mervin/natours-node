import { NextFunction, Request, Response } from 'express';
import { catchAsyncPage } from '../utils/routerFunctions.js';
import Tour from '../models/tourModel.js';
import { CustomError } from '../classes/customError.js';
import Booking from '../models/bookingModel.js';

// export const renderHome = catchAsync(async function (
//   req: Request,
//   res: Response
// ) {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//   });
// });

export const renderOverview = catchAsyncPage(async function (
  req: Request,
  res: Response
) {
  const tours = await Tour.find();

  res.status(200).render(
    'overview',
    {
      title: 'All Tours',
      tours,
    },
    (error, html) => {
      if (error) throw new CustomError('Something went wrong', 500);
      res.send(html);
    }
  );
});

export const renderTours = catchAsyncPage(async function (
  req: Request,
  res: Response
) {
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  res.status(200).render(
    'tour',
    {
      title: `${tour?.name || ''} Tour`,
      tour,
    },
    (error, html) => {
      if (error) throw new CustomError('Something went wrong', 500);
      res.send(html);
    }
  );
});

export const renderLogin = catchAsyncPage(async function (
  req: Request,
  res: Response
) {
  if (!res.locals.user) {
    return res
      .status(200)
      .render('login', { title: 'Login' }, (error, html) => {
        if (error) throw new CustomError('Something went wrong', 500);
        res.send(html);
      });
  }
  return res.redirect('/');
});

export const renderFallback = catchAsyncPage(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  throw new CustomError('Page not found', 404);
});

export const renderAccount = catchAsyncPage(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;

  res
    .status(200)
    .render('account', { user, title: user.name }, (error, html) => {
      if (error) throw new CustomError('Something went wrong', 500);
      res.send(html);
    });
});

export const renderMyTours = catchAsyncPage(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIds = bookings.map((booking) => booking.tour);

  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});
