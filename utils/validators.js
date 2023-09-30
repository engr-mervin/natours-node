export const validator = function (regex) {
    return function (val) {
        return regex.test(val);
    };
};
