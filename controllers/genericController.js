import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
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