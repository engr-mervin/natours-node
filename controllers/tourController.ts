import { NextFunction, Request, Response } from 'express';
import { tours } from '../initialize.js';
import { __rootdirname } from '../paths.js';
// import { Tour } from '../utils/types.js';
import fs from 'node:fs';
import { TOURS_SIMPLE } from '../paths.js';
import { JSEND } from '../utils/types.js';
import Tour from '../models/tourModel.js';

export const checkID = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: any
) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  req.payload = { tour };

  next();
};

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body?.name || !req.body?.price) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Incomplete data sent.' });
  }

  next();
};

export const getAllTours = (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

export const getTour = (req: Request, res: Response) =>
  res.status(200).json({ status: 'success', data: req.payload.tour });

export const createTour = (req: Request, res: Response) => {
  const newId: number = tours.length;
  const newTour: Tour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(TOURS_SIMPLE, JSON.stringify(tours), (err) => {
    if (err) {
      res.status(500).send('Something went wrong.');
    } else {
      const data: JSEND = {
        status: 'success',
        data: {
          tours: newTour,
        },
      };
      res.status(201).json(data);
    }
  });
};

export const updateTour = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: 'success', data: { ...req.payload.tour, ...req.body } });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({ status: 'success', data: null });
};
