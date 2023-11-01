import Review from '../models/reviewModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import { createOne, deleteOne, updateOne } from './genericController.js';
export const getAllReviews = catchAsync(async function (req, res, next) {
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
export const getReviewById = catchAsync(async function (req, res, next) {
    const review = await Review.findById(req.params.id);
    if (!review)
        throw new CustomError('Review not found', 404);
    res.status(200).json({
        status: 'success',
        data: {
            review,
        },
    });
});
export const setIDs = async function (req, res, next) {
    if (!req.body.tour) {
        req.body.tour = req.params.id;
    }
    req.body.user = req.user._id;
    next();
};
export const restrictToOwner = catchAsync(async function (req, res, next) {
    const currentReview = await Review.findById(req.params.id);
    if (currentReview?.user !== req.user._id) {
        throw new CustomError("You can't edit reviews you didn't make", 403);
    }
    next();
});
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
