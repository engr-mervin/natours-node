export const catchAsync = function (func) {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
};
