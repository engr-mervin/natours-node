import Review from '../models/reviewModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
export const getAllReviews = catchAsync(async function (req, res, next) {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});
export const createReview = catchAsync(async function (req, res, next) {
    const review = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tour,
        user: req.user._id,
    });
    res.status(201).json({
        status: 'success',
        data: {
            review,
        },
    });
});
