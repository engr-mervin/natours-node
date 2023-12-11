//@ts-nocheck
import { Schema, model } from 'mongoose';
import { validator } from '../utils/validators.js';
import { registerOrigin } from '../utils/query-helpers.js';
import Tour from './tourModel.js';
const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, 'Please state your review.'],
        trim: true,
        maxlength: [200, 'A review can contain at most 200 characters.'],
        minlength: [10, 'A review can contain at least 10 characters.'],
        validate: {
            validator: validator(/^[A-Za-z0-9\.\,\-\'\"\!\? ]+$/),
            message: 'The review is limited to alphanumeric characters and a few symbols only.',
        },
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating.'],
        min: [1, 'Rating should be at least 1.0'],
        max: [5, 'Rating should be at most 5.0'],
    },
    createdAt: { type: Date, default: Date.now() },
    tour: {
        type: Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour.'],
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must have an author'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, registerOrigin('review'));
reviewSchema.pre(/^find/, function (next) {
    if (this.options.origin === 'tour')
        return next();
    this.populate({
        path: 'user',
        select: 'name photo',
        options: {
            origin: this.options.origin,
        },
    });
    next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length === 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 0,
        });
        return;
    }
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
    });
};
reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.post(/^findOneAnd/, async function (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
});
const Review = model('Review', reviewSchema);
export default Review;
