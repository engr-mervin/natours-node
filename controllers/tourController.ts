import { NextFunction, Request, Response } from 'express';
import Tour from '../models/tourModel.js';
import { JSEND } from '../utils/types.js';
export const getAllTours = async (req: Request, res: Response) => {
  const query = req.query;
  try {
    let filteredTours = await Tour.find(req.query);

    const data: JSEND = {
      status: 'success',
      results: filteredTours.length,
      data: {
        tour: filteredTours,
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);

    const data: JSEND = {
      status: 'success',
      data: {
        tour,
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);
    const data: JSEND = {
      status: 'success',
      data: {
        tour: newTour,
      },
    };
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Bad request.',
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const data: JSEND = {
      status: 'success',
      data: {
        tour: updatedTour,
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    const data: JSEND = {
      status: 'success',
    };

    return res.status(204).json(data);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
