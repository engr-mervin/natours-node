import Tour from '../models/tourModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import { createOne, deleteOne, getAll, getOne, updateOne, } from './genericController.js';
// export const getTour = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const tour = await Tour.findById(req.params.id).populate({
//       path: 'reviews',
//       options: {
//         origin: 'tour',
//       },
//     });
//     if (tour === null) {
//       throw new CustomError('No tour found with that ID', 404);
//     }
//     return res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   }
// );
export const aliasTop = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage -ratingsQuantity';
    req.query.fields = 'name price ratingsAverage summary difficulty';
    next();
};
export const getTour = getOne(Tour, {
    path: 'reviews',
    options: {
        origin: 'tour',
    },
});
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const getAllTours = getAll(Tour);
export const deleteTour = deleteOne(Tour);
//router.route('/tours-within/:distance/center/:latlng/unit/:unit');
//tours-within/233/center/34.111745,-118.113491/unit/mi
export const getToursWithin = catchAsync(async function (req, res, next) {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!distance || isNaN(+distance)) {
        throw new CustomError('Please provide a valid distance', 400);
    }
    if (!lat || !lng || isNaN(+lat) || isNaN(+lng)) {
        throw new CustomError('Please provide a valid latitude and longitude', 400);
    }
    if (unit !== 'mi' && unit !== 'km') {
        throw new CustomError('Please provide a valid unit', 400);
    }
    const radiusOfEarth = unit === 'mi' ? 3963.2 : 6378.1;
    const radiusInRadians = +distance / radiusOfEarth;
    const tours = await Tour.find({
        startLocation: {
            $geoWithin: { $centerSphere: [[lng, lat], radiusInRadians] },
        },
    });
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});
export const getDistances = catchAsync(async function (req, res, next) {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng || isNaN(+lat) || isNaN(+lng)) {
        throw new CustomError('Please provide a valid latitude and longitude', 400);
    }
    if (unit !== 'mi' && unit !== 'km') {
        throw new CustomError('Please provide a valid unit', 400);
    }
    const multiplier = unit === 'km' ? 0.001 : 0.0006213727;
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
                _id: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: { distances },
    });
});
export const getTourStats = catchAsync(async function (req, res, next) {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.0 } },
        },
        {
            $group: {
                _id: '$difficulty',
                numRatings: { $sum: '$ratingsQuantity' },
                num: { $sum: 1 },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { minPrice: 1 },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});
export const getMonthlyPlan = catchAsync(async function (req, res, next) {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`),
                },
            },
        },
        {
            $group: {
                _id: {
                    $month: '$startDates',
                },
                numTours: {
                    $sum: 1,
                },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
    ]);
    console.log(year);
    res.status(200).json({
        status: 'success',
        data: { plan },
    });
});
