import Tour from '../models/tourModel.js';
import { QueryManager } from '../classes/queryManager.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
export const getAllTours = catchAsync(async (req, res, next) => {
    //create a query
    let queryClass = new QueryManager(Tour.find(), req.query)
        .filter()
        .sort()
        .select()
        .limit();
    //exchange query for data
    const filteredTours = await queryClass.query;
    if (filteredTours.length === 0) {
        throw new Error('No results found');
    }
    const data = {
        status: 'success',
        results: filteredTours.length,
        data: {
            tour: filteredTours,
        },
    };
    return res.status(200).json(data);
});
export const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (tour === null) {
        throw new CustomError('No tour found with that ID', 404);
    }
    const data = {
        status: 'success',
        data: {
            tour,
        },
    };
    return res.status(200).json(data);
});
export const aliasTop = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage -ratingsQuantity';
    req.query.fields = 'name price ratingsAverage summary difficulty';
    next();
};
export const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    const data = {
        status: 'success',
        data: {
            tour: newTour,
        },
    };
    res.status(201).json(data);
});
export const updateTour = catchAsync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    const data = {
        status: 'success',
        data: {
            tour: updatedTour,
        },
    };
    return res.status(200).json(data);
});
export const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (tour === null) {
        const error404 = new CustomError('No tour found with that ID', 404);
        return next(error404);
    }
    const data = {
        status: 'success',
    };
    return res.status(204).json(data);
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
