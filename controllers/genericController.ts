import { Model, PopulateOptions } from 'mongoose';
import { catchAsync } from '../utils/routerFunctions.js';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../classes/customError.js';
import { QueryManager } from '../classes/queryManager.js';

export const deleteOne = function (Model: Model<any>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const modelName = Model.modelName.toLowerCase();
    const instance = await Model.findByIdAndDelete(
      req.params[`${modelName}Id`]
    );

    if (instance === null) {
      throw new CustomError(
        `No ${Model.modelName} found with that ID: ${
          req.params[`${modelName}Id`]
        }`,
        404
      );
    }

    return res.status(204).json({
      status: 'success',
    });
  });
};

export const updateOne = function (Model: Model<any>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const modelName = Model.modelName.toLowerCase();
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params[`${modelName}Id`],
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: 'success',
      data: {
        [`${modelName}`]: updatedDoc,
      },
    });
  });
};

export const createOne = function (Model: Model<any>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newDoc = await Model.create(req.body);
    const data = {
      status: 'success',
      data: {
        [`${Model.modelName.toLowerCase()}`]: newDoc,
      },
    };
    res.status(201).json(data);
  });
};

export const allowFields = function (allowList: string[]) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const bodyCopy = JSON.parse(JSON.stringify(req.body));
    for (const item in bodyCopy) {
      if (!allowList.includes(item)) {
        delete req.body[item];
      }
    }
    next();
  });
};

export const removeFields = function (removeList: string[]) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const bodyCopy = JSON.parse(JSON.stringify(req.body));
    for (const item in bodyCopy) {
      if (removeList.includes(item)) {
        delete req.body[item];
      }
    }
    next();
  });
};

export const limitToOnePerUser = function (
  Model: Model<any>,
  identifier: string = 'user'
) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user._id) throw new CustomError('No user found.', 400);

    const instance = await Model.findOne({ [identifier]: req.user._id });

    if (instance) {
      throw new CustomError(
        `Only one instance of ${Model.modelName} per ${identifier} is allowed.`,
        400
      );
    }

    next();
  });
};

export const getOne = function (
  Model: Model<any>,
  populateObj:
    | PopulateOptions
    | undefined
    | (string | PopulateOptions)[] = undefined
) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const modelName = Model.modelName.toLowerCase();
    const doc = populateObj
      ? await Model.findById(req.params[`${modelName}Id`]).populate(populateObj)
      : await Model.findById(req.params[`${modelName}Id`]);

    if (!doc) throw new CustomError(`${modelName} not found`, 404);
    res.status(200).json({
      status: 'success',
      data: {
        [`${modelName}`]: doc,
      },
    });
  });
};

export const getAll = function (Model: Model<any>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //create a query
    let queryManager = new QueryManager(Model.find(req.filterObj), req.query)
      .filter()
      .sort()
      .select()
      .limit();

    //exchange query for data
    const filteredData = await queryManager.query;

    // if (filteredData.length === 0) {
    //   throw new CustomError(`No ${Model.modelName}s found`, 404);
    // }

    return res.status(200).json({
      status: 'success',
      results: filteredData.length,
      data: {
        [`${Model.modelName.toLowerCase()}s`]: filteredData,
      },
    });
  });
};

export const cleanData = function (deleteFields: string[]) {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {});
};
