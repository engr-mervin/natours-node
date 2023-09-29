import Tour from '../models/tourModel.js';
import { QueryManager } from '../utils/queryManager.js';
export const getAllTours = async (req, res) => {
    try {
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
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};
export const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        const data = {
            status: 'success',
            data: {
                tour,
            },
        };
        return res.status(200).json(data);
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
export const aliasTop = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage -ratingsQuantity';
    req.query.fields = 'name price ratingsAverage summary difficulty';
    next();
};
export const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        const data = {
            status: 'success',
            data: {
                tour: newTour,
            },
        };
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Bad request.',
        });
    }
};
export const updateTour = async (req, res) => {
    try {
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
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
export const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        const data = {
            status: 'success',
        };
        return res.status(204).json(data);
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
export const getTourStats = async function (req, res) {
    try {
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
        res.status(400).json({
            status: 'success',
            message: stats,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
export const getMonthlyPlan = async function (req, res) {
    try {
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
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
