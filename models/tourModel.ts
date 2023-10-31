//@ts-nocheck
import mongoose from '../mongooseClient.js';
import slugify from 'slugify';
import { validator } from '../utils/validators.js';
import { registerOrigin } from '../utils/query-helpers.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have at most 40 Characters'],
      minlength: [10, 'A tour name must have at least 10 characters'],
      validate: {
        validator: validator(/^[A-Za-z ]+$/),
        message: 'Name should only be alphabetical characters',
      },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating should be at least 1.0'],
      max: [5, 'Rating should be at most 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          //'this' only exists on create Tour, but not on update Tour
          return val <= this.price;
        },
        message: `Discount price ({VALUE}) should be below regular price.`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//embedding
// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map((id) => User.findById(id));
//   const guides = await Promise.all(guidePromises);
//   this.guides = guides;

//   next();
// });

//runs after save
tourSchema.post('save', function (doc, next) {
  next();
});

tourSchema.pre(/^find/, registerOrigin('tour'));

//QUERY MIDDLEWARE:
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startTime = performance.now();
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  if (this.options.origin !== 'tour') return next();

  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
    options: {
      origin: this.options.origin,
    },
  });

  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
