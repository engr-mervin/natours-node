import { Schema, model } from 'mongoose';
import { validator } from '../utils/validators.js';
const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, 'Please state your review.'],
        trim: true,
        maxlength: [200, 'A review can contain at most 200 characters.'],
        minlength: [10, 'A review can contain at least 10 characters.'],
        validate: {
            validator: validator(/^[A-Za-z0-9\.\,\-\'\" ]+$/),
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
        required: 'A review must have an author',
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Review = model('Review', reviewSchema);
export default Review;
