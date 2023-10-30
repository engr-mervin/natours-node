export const registerOrigin = function (origin) {
    return function (next) {
        this.options.origin = this.options.origin || origin;
        next();
    };
};
