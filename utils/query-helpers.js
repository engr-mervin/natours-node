export const registerOrigin = function (origin) {
    return function (next) {
        console.log('before', origin, this.options.origin);
        this.options.origin = this.options.origin || origin;
        console.log('after', origin, this.options.origin);
        next();
    };
};
