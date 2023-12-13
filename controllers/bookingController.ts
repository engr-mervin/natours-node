//@ts-nocheck
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/routerFunctions.js';
import Tour from '../models/tourModel.js';
import { CustomError } from '../classes/customError.js';
import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getCheckoutSession = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) throw new CustomError('Tour not found', 404);

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://localhost:3000/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://localhost:3000/tour/${tour.slug}`,
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
