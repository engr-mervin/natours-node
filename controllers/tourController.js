import Tour from '../models/tourModel.js';
export const getAllTours = async (req, res) => {
    const query = req.query;
    try {
        let filteredTours = await Tour.find(req.query);
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
        res.status(400).json({
            status: 'fail',
            message: error,
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
