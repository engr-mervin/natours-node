import { catchAsync } from '../utils/routerFunctions.js';
import Tour from '../models/tourModel.js';
import { CustomError } from '../classes/customError.js';
import Booking from '../models/bookingModel.js';
import { stripeClient } from '../services/stripe.js';
import User from '../models/userModel.js';
export const getCheckoutSession = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour)
        throw new CustomError('Tour not found', 404);
    const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        /*success_url: `${process.env.DEV_URL!}/?tour=${req.params.tourId}&user=${
          req.user.id
        }&price=${tour.price}`,*/
        success_url: `${process.env.DEV_URL}/my-tours?alert=booking`,
        cancel_url: `${process.env.DEV_URL}/tour/${tour.slug}`,
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
                        images: [`${process.env.DEV_URL}/img/tours/${tour.imageCover}`],
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
/*

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

*/
export const createBookingCheckout = async function (session) {
    console.log(session);
    const user = await User.findOne({ email: session.customer_email })._id;
    const tour = session.client_reference_id;
    const price = session.amount_total / 100;
    await Booking.create({ tour, user, price });
};
