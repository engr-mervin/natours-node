import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import { QueryManager } from '../classes/queryManager.js';
export const deleteOne = function (Model) {
    return catchAsync(async (req, res, next) => {
        const instance = await Model.findByIdAndDelete(req.params.id);
        if (instance === null) {
            throw new CustomError(`No ${Model.modelName} found with that ID: ${req.params.id}`, 404);
        }
        return res.status(204).json({
            status: 'success',
        });
    });
};
export const updateOne = function (Model) {
    return catchAsync(async (req, res, next) => {
        const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            status: 'success',
            data: {
                [`${Model.modelName.toLowerCase()}`]: updatedDoc,
            },
        });
    });
};
export const createOne = function (Model) {
    return catchAsync(async (req, res, next) => {
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
export const allowFields = function (allowList) {
    return catchAsync(async function (req, res, next) {
        const bodyCopy = JSON.parse(JSON.stringify(req.body));
        for (const item in bodyCopy) {
            if (!allowList.includes(item)) {
                delete req.body[item];
            }
        }
        next();
    });
};
export const removeFields = function (removeList) {
    return catchAsync(async function (req, res, next) {
        const bodyCopy = JSON.parse(JSON.stringify(req.body));
        for (const item in bodyCopy) {
            if (removeList.includes(item)) {
                delete req.body[item];
            }
        }
        next();
    });
};
export const getOne = function (Model, populateObj = undefined) {
    return catchAsync(async function (req, res, next) {
        const doc = populateObj
            ? await Model.findById(req.params.id).populate(populateObj)
            : await Model.findById(req.params.id);
        if (!doc)
            throw new CustomError(`${Model.modelName} not found`, 404);
        res.status(200).json({
            status: 'success',
            data: {
                [`${Model.modelName}`]: doc,
            },
        });
    });
};
export const getAll = function (Model) {
    return catchAsync(async (req, res, next) => {
        //create a query
        let queryManager = new QueryManager(Model.find(req.filterObj), req.query)
            .filter()
            .sort()
            .select()
            .limit();
        //exchange query for data
        const filteredData = await queryManager.query;
        if (filteredData.length === 0) {
            throw new Error(`No ${Model.modelName}s found`);
        }
        return res.status(200).json({
            status: 'success',
            results: filteredData.length,
            data: {
                [`${Model.modelName.toLowerCase()}s`]: filteredData,
            },
        });
    });
};
export const cleanData = function (deleteFields) {
    return catchAsync(async function (req, res, next) { });
};
