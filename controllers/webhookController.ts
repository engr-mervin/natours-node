import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/routerFunctions.js';
import { stripeClient } from '../services/stripe.js';
import { CustomError } from '../classes/customError.js';
import { createBookingCheckout } from './bookingController.js';

export const stripeCheckout = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const signature = req.headers['stripe-signature'];

    if (signature === undefined) throw new CustomError('Signature Missing.');

    const event = stripeClient.webhooks.constructEvent(
      req.body,
      signature,
      process.env.NODE_ENV === 'production'
        ? process.env.ENDPOINT_SECRET!
        : process.env.ENDPOINT_SECRET_DEV!
    );

    console.log(event.type);
    if (!event) throw new CustomError('Missing event.');

    if (event.type !== 'checkout.session.completed')
      throw new CustomError('Unexpected event.');

    await createBookingCheckout(event.data.object);
    res.status(200).send({
      status: 'success',
      message: 'Received payment',
    });
  } catch (error: any) {
    res.status(400).send({
      status: 'error',
      message: error.message,
    });
  }
});
